from fastapi import HTTPException
from typing import Dict, Any
import logging

from app.models.elicitation import ElicitationRequest, ElicitationResponse, ClarifyingQuestion, UserPersona
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class ElicitationController:
    """Controller for handling elicitation requests."""
    
    @staticmethod
    async def process_elicitation(request: ElicitationRequest) -> ElicitationResponse:
        """
        Process an elicitation request and return clarifying questions and personas.
        
        Args:
            request (ElicitationRequest): The user's project idea
            
        Returns:
            ElicitationResponse: Structured response with questions and personas
        """
        try:
            print(f"🎯 Processing elicitation request...")
            print(f"📝 Request idea: {request.idea[:100]}...")
            
            # Generate content using Gemini AI
            print(f"🤖 Calling Gemini service...")
            ai_response = gemini_service.generate_elicitation_content(request.idea)
            print(f"✅ Received AI response: {ai_response}")
            
            # Convert AI response to structured models
            print(f"🔄 Converting AI response to structured models...")
            questions = [
                ClarifyingQuestion(
                    question=q["question"],
                    category=q["category"],
                    priority=q["priority"]
                )
                for q in ai_response.get("questions", [])
            ]
            print(f"❓ Created {len(questions)} questions")
            
            personas = [
                UserPersona(
                    name=p["name"],
                    role=p["role"],
                    description=p["description"],
                    goals=p["goals"],
                    pain_points=p["pain_points"]
                )
                for p in ai_response.get("personas", [])
            ]
            print(f"👥 Created {len(personas)} personas")
            
            # Create response
            response = ElicitationResponse(
                questions=questions,
                personas=personas,
                summary=ai_response.get("summary", "Analysis completed"),
                next_steps=ai_response.get("next_steps", [])
            )
            
            print(f"✅ Successfully created ElicitationResponse")
            logger.info(f"Successfully processed elicitation for idea: {request.idea[:50]}...")
            return response
            
        except Exception as e:
            print(f"❌ Error in process_elicitation: {str(e)}")
            print(f"❌ Error type: {type(e)}")
            import traceback
            print(f"❌ Full traceback: {traceback.format_exc()}")
            logger.error(f"Error processing elicitation: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process elicitation request: {str(e)}"
            )

# Create a singleton instance
elicitation_controller = ElicitationController() 