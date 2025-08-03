from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
import logging

from app.models.elicitation import ElicitationRequest, ElicitationResponse
from app.controllers.elicitation_controller import elicitation_controller
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/elicit", response_model=ElicitationResponse)
async def elicit_requirements(request: ElicitationRequest):
    """
    Generate clarifying questions and user personas from a project idea.
    
    This endpoint takes a user's initial project idea and uses AI to generate:
    - Clarifying questions to better understand requirements
    - User personas that would use the system
    - A summary of the analysis
    - Recommended next steps
    
    Args:
        request (ElicitationRequest): Contains the user's project idea
        
    Returns:
        ElicitationResponse: Structured response with questions, personas, summary, and next steps
        
    Raises:
        HTTPException: If processing fails or API key is missing
    """
    try:
        # Validate that Gemini API key is available
        if not settings.gemini_api_key:
            raise HTTPException(
                status_code=500,
                detail="Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
            )
        
        # Process the elicitation request
        response = await elicitation_controller.process_elicitation(request)
        
        logger.info(f"Successfully generated elicitation for idea: {request.idea[:50]}...")
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error in elicitation endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/elicit/health")
async def elicitation_health_check():
    """
    Health check endpoint for the elicitation service.
    
    Returns:
        JSONResponse: Status of the elicitation service
    """
    try:
        # Check if Gemini API key is configured
        if not settings.gemini_api_key:
            return JSONResponse(
                status_code=503,
                content={
                    "status": "unhealthy",
                    "service": "elicitation",
                    "error": "Gemini API key not configured"
                }
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "healthy",
                "service": "elicitation",
                "gemini_configured": True
            }
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "elicitation",
                "error": str(e)
            }
        ) 