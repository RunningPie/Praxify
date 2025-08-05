import warnings
from google import genai
from google.genai import types
import json
import logging
from typing import List, Dict, Any
from app.core.config import settings

# Suppress Pydantic warnings from Google Generative AI SDK
warnings.filterwarnings("ignore", message="Field name .* shadows an attribute in parent")

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        print(f"🔧 Initializing GeminiService...")
        print(f"🔑 API Key available: {bool(settings.gemini_api_key)}")
        if settings.gemini_api_key:
            print(f"🔑 API Key preview: {settings.gemini_api_key[:10]}...")
        
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = "gemini-2.0-flash-lite"
        print(f"🤖 Model set to: {self.model}")
        print(f"✅ GeminiService initialized successfully")
        
    def generate_elicitation_content(self, project_idea: str) -> Dict[str, Any]:
        """
        Generate clarifying questions and user personas from a project idea.
        
        Args:
            project_idea (str): The user's initial project idea
            
        Returns:
            Dict containing questions, personas, summary, and next steps
        """
        try:
            print(f"🔍 Starting elicitation for project idea: {project_idea[:100]}...")
            print(f"🔑 Using Gemini API key: {settings.gemini_api_key[:10] if settings.gemini_api_key else 'NOT SET'}...")
            print(f"🤖 Using model: {self.model}")
            
            prompt = self._build_elicitation_prompt(project_idea)
            print(f"📝 Generated prompt length: {len(prompt)} characters")
            print(f"📝 Prompt preview: {prompt[:200]}...")
            
            print("🚀 Sending request to Gemini API...")
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=2048
                    # thinking_config=types.ThinkingConfig(thinking_budget=12544)
                )
            )
            
            print("✅ Received response from Gemini API")
            print(f"📄 Response type: {type(response)}")
            print(f"📄 Response text length: {len(response.text) if hasattr(response, 'text') else 'No text attribute'}")
            
            # Parse the response
            content = response.text
            print(f"📄 Raw response content: {content}")
            return self._parse_elicitation_response(content)
            
        except Exception as e:
            print(f"❌ Error in generate_elicitation_content: {str(e)}")
            print(f"❌ Error type: {type(e)}")
            import traceback
            print(f"❌ Full traceback: {traceback.format_exc()}")
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
4. Recommended next steps that can be done right now while writing the requirements

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

Choose question categories from this list: functional, technical, business, user, legal/compliance

Ensure all questions are specific and actionable.
Provide your response in a friendly and conversational tone. Use Bahasa Indonesia.
"""
    
    def _parse_elicitation_response(self, content: str) -> Dict[str, Any]:
        """Parse the Gemini response into structured data."""
        try:
            print(f"🔍 Parsing response content...")
            print(f"📄 Content length: {len(content)}")
            print(f"📄 Content preview: {content[:500]}...")
            
            # Extract JSON from the response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            
            print(f"🔍 JSON start index: {start_idx}")
            print(f"🔍 JSON end index: {end_idx}")
            
            if start_idx == -1 or end_idx == 0:
                print(f"❌ No JSON brackets found in response")
                print(f"📄 Full content: {content}")
                raise ValueError("No JSON found in response")
            
            json_str = content[start_idx:end_idx]
            print(f"📄 Extracted JSON string: {json_str}")
            
            parsed_data = json.loads(json_str)
            print(f"✅ Successfully parsed JSON")
            print(f"📊 Parsed data keys: {list(parsed_data.keys())}")
            
            # Validate required fields
            required_fields = ['questions', 'personas', 'summary', 'next_steps']
            for field in required_fields:
                if field not in parsed_data:
                    print(f"❌ Missing required field: {field}")
                    raise ValueError(f"Missing required field: {field}")
                else:
                    print(f"✅ Found required field: {field}")
            
            print(f"✅ All required fields present")
            return parsed_data
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {str(e)}")
            print(f"📄 JSON string that failed: {json_str}")
            logger.error(f"Failed to parse JSON response: {str(e)}")
            # Fallback: return a basic structure
            fallback_data = {
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
            print(f"🔄 Using fallback data: {fallback_data}")
            return fallback_data
        except Exception as e:
            print(f"❌ Error parsing elicitation response: {str(e)}")
            print(f"❌ Error type: {type(e)}")
            import traceback
            print(f"❌ Full traceback: {traceback.format_exc()}")
            logger.error(f"Error parsing elicitation response: {str(e)}")
            raise Exception(f"Failed to parse elicitation response: {str(e)}")

# Create a singleton instance
gemini_service = GeminiService() 