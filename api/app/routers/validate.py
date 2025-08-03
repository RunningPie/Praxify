from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
import logging

from app.models.validation import ValidationRequest, ValidationResponse
from app.controllers.validation_controller import validation_controller
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/validate", response_model=ValidationResponse)
async def validate_requirements(request: ValidationRequest):
    """
    Validate a requirements document for quality issues.
    
    This endpoint analyzes a requirements document and identifies:
    - Ambiguous terms and phrases
    - Incomplete or vague requirements
    - Technical debt indicators
    - Business risk factors
    - Overall quality score and suggestions
    
    Args:
        request (ValidationRequest): Contains the document to validate
        
    Returns:
        ValidationResponse: Structured response with validation results
        
    Raises:
        HTTPException: If processing fails or API key is missing
    """
    try:
        print(f"🚀 Validation endpoint called")
        print(f"📄 Document length: {len(request.document)} characters")
        print(f"🎯 Focus areas: {request.focus_areas}")
        
        # No external API dependencies for validation
        print(f"✅ Using classic CS rule-based validation (no external APIs required)")
        
        # Process the validation request
        print(f"🔄 Processing validation request...")
        response = await validation_controller.process_validation(request)
        
        print(f"✅ Successfully processed validation")
        logger.info(f"Successfully validated document: {len(request.document)} chars")
        return response
        
    except HTTPException:
        print(f"❌ HTTPException raised, re-raising...")
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"❌ Unexpected error in validation endpoint: {str(e)}")
        print(f"❌ Error type: {type(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
        logger.error(f"Unexpected error in validation endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/validate/health")
async def validation_health_check():
    """
    Health check endpoint for the validation service.
    
    Returns:
        JSONResponse: Status of the validation service
    """
    try:
        print(f"🏥 Validation health check endpoint called")
        
        # Validation service is self-contained (no external APIs)
        print(f"✅ Validation service is self-contained")
        return JSONResponse(
            status_code=200,
            content={
                "status": "healthy",
                "service": "validation",
                "self_contained": True,
                "features": ["ambiguity_check", "completeness_check", "rule_based_validation", "ner_enhanced_validation"]
            }
        )
        
    except Exception as e:
        print(f"❌ Validation health check failed: {str(e)}")
        print(f"❌ Error type: {type(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
        logger.error(f"Validation health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "validation",
                "error": str(e)
            }
        )

@router.get("/validate/test")
async def test_validation_service():
    """
    Test endpoint to verify validation service functionality.
    
    Returns:
        JSONResponse: Test result
    """
    try:
        print(f"🧪 Testing validation service...")
        
        # Test document with known issues
        test_document = """
        The system should be fast and user-friendly.
        Users can access the data when needed.
        The application should handle errors appropriately.
        Performance should be good under normal conditions.
        The system will be scalable and reliable.
        """
        
        print(f"📄 Testing with sample document: {len(test_document)} characters")
        
        # Test validation service
        from app.services.validation_service import validation_service
        result = validation_service.validate_document(test_document)
        
        print(f"✅ Validation test successful")
        print(f"📊 Quality score: {result['score']}")
        print(f"❌ Issues found: {result['issue_count']}")
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "Validation service test passed",
                "score": result["score"],
                "issue_count": result["issue_count"],
                "summary": result["summary"]
            }
        )
        
    except Exception as e:
        print(f"❌ Validation service test failed: {str(e)}")
        print(f"❌ Error type: {type(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
        
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "Validation service test failed",
                "error": str(e)
            }
        ) 