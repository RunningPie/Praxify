from google import genai
from google.genai import types
import json
import logging
from typing import List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = "gemini-2.5-flash-lite"
        
    def generate_elicitation_content(self, project_idea: str) -> Dict[str, Any]:
        """
        Generate clarifying questions and user personas from a project idea.
        
        Args:
            project_idea (str): The user's initial project idea
            
        Returns:
            Dict containing questions, personas, summary, and next steps
        """
        try:
            prompt = self._build_elicitation_prompt(project_idea)
            
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=2048,
                    thinking_config=types.ThinkingConfig(thinking_budget=0.1)
                )
            )
            
            # Parse the response
            content = response.text
            return self._parse_elicitation_response(content)
            
        except Exception as e:
            logger.error(f"Error generating elicitation content: {str(e)}")
            raise Exception(f"Failed to generate elicitation content: {str(e)}")
    
    def _build_elicitation_prompt(self, project_idea: str) -> str:
        """Build the prompt for elicitation analysis."""
        return f"""
You are an expert requirements analyst helping to clarify a software project idea. 
Analyze the following project idea and provide:

1. 5-8 clarifying questions to better understand the requirements
2. 2-3 user personas that would use this system
3. A brief summary of the analysis
4. Recommended next steps

Project Idea: {project_idea}

Please respond in the following JSON format:
{{
    "questions": [
        {{
            "question": "What specific problem are you trying to solve?",
            "category": "functional",
            "priority": "high"
        }}
    ],
    "personas": [
        {{
            "name": "Primary User",
            "role": "End User",
            "description": "Description of the persona",
            "goals": ["Goal 1", "Goal 2"],
            "pain_points": ["Pain point 1", "Pain point 2"]
        }}
    ],
    "summary": "Brief analysis of the project idea",
    "next_steps": ["Step 1", "Step 2", "Step 3"]
}}

Focus on:
- Uncovering hidden requirements
- Identifying stakeholders
- Understanding business context
- Technical feasibility considerations
- User experience requirements

Ensure all questions are specific and actionable.
"""
    
    def _parse_elicitation_response(self, content: str) -> Dict[str, Any]:
        """Parse the Gemini response into structured data."""
        try:
            # Extract JSON from the response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No JSON found in response")
            
            json_str = content[start_idx:end_idx]
            parsed_data = json.loads(json_str)
            
            # Validate required fields
            required_fields = ['questions', 'personas', 'summary', 'next_steps']
            for field in required_fields:
                if field not in parsed_data:
                    raise ValueError(f"Missing required field: {field}")
            
            return parsed_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {str(e)}")
            # Fallback: return a basic structure
            return {
                "questions": [
                    {
                        "question": "Could you provide more details about your project idea?",
                        "category": "general",
                        "priority": "high"
                    }
                ],
                "personas": [
                    {
                        "name": "Primary User",
                        "role": "End User",
                        "description": "The main user of the system",
                        "goals": ["Complete their tasks efficiently"],
                        "pain_points": ["Current process is inefficient"]
                    }
                ],
                "summary": "Analysis of your project idea",
                "next_steps": ["Define specific requirements", "Identify stakeholders", "Create user stories"]
            }
        except Exception as e:
            logger.error(f"Error parsing elicitation response: {str(e)}")
            raise Exception(f"Failed to parse elicitation response: {str(e)}")

# Create a singleton instance
gemini_service = GeminiService() 