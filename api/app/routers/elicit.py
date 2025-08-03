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
        print(f"🚀 Elicitation endpoint called")
        print(f"📝 Request idea: {request.idea[:100]}...")
        
        # Validate that Gemini API key is available
        print(f"🔑 Checking Gemini API key...")
        if not settings.gemini_api_key:
            print(f"❌ Gemini API key not configured")
            raise HTTPException(
                status_code=500,
                detail="Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
            )
        print(f"✅ Gemini API key is configured")
        
        # Process the elicitation request
        print(f"🔄 Processing elicitation request...")
        response = await elicitation_controller.process_elicitation(request)
        
        print(f"✅ Successfully processed elicitation")
        logger.info(f"Successfully generated elicitation for idea: {request.idea[:50]}...")
        return response
        
    except HTTPException:
        print(f"❌ HTTPException raised, re-raising...")
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"❌ Unexpected error in elicitation endpoint: {str(e)}")
        print(f"❌ Error type: {type(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
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
        print(f"🏥 Health check endpoint called")
        
        # Check if Gemini API key is configured
        print(f"🔑 Checking Gemini API key in health check...")
        if not settings.gemini_api_key:
            print(f"❌ Gemini API key not configured in health check")
            return JSONResponse(
                status_code=503,
                content={
                    "status": "unhealthy",
                    "service": "elicitation",
                    "error": "Gemini API key not configured"
                }
            )
        
        print(f"✅ Gemini API key is configured in health check")
        return JSONResponse(
            status_code=200,
            content={
                "status": "healthy",
                "service": "elicitation",
                "gemini_configured": True
            }
        )
        
    except Exception as e:
        print(f"❌ Health check failed: {str(e)}")
        print(f"❌ Error type: {type(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "elicitation",
                "error": str(e)
            }
        )

@router.get("/elicit/test")
async def test_gemini_service():
    """
    Test endpoint to verify Gemini service initialization.
    
    Returns:
        JSONResponse: Test result
    """
    try:
        print(f"🧪 Testing Gemini service initialization...")
        
        # Test if we can create the Gemini service
        from app.services.gemini_service import gemini_service
        print(f"✅ Gemini service created successfully")
        
        # Test if we can make a simple request
        test_prompt = "Say hello in one word"
        print(f"🧪 Testing simple Gemini request...")
        
        response = gemini_service.client.models.generate_content(
            model=gemini_service.model,
            contents=test_prompt
        )
        
        print(f"✅ Simple Gemini request successful")
        print(f"📄 Response: {response.text}")
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "Gemini service test passed",
                "response": response.text
            }
        )
        
    except Exception as e:
        print(f"❌ Gemini service test failed: {str(e)}")
        print(f"❌ Error type: {type(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
        
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "Gemini service test failed",
                "error": str(e)
            }
        ) 