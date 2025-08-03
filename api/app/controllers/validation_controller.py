from fastapi import HTTPException
from typing import Dict, Any
import logging

from app.models.validation import ValidationRequest, ValidationResponse
from app.services.validation_service import validation_service

logger = logging.getLogger(__name__)

class ValidationController:
    """Controller for handling validation requests."""
    
    @staticmethod
    async def process_validation(request: ValidationRequest) -> ValidationResponse:
        """
        Process a validation request and return quality analysis results.
        
        Args:
            request (ValidationRequest): The document to validate
            
        Returns:
            ValidationResponse: Structured response with validation results
        """
        try:
            print(f"🎯 Processing validation request...")
            print(f"📄 Document length: {len(request.document)} characters")
            print(f"🎯 Focus areas: {request.focus_areas}")
            
            # Validate document using validation service
            print(f"🔍 Calling validation service...")
            validation_result = validation_service.validate_document(
                request.document, 
                request.focus_areas
            )
            print(f"✅ Received validation result")
            
            # Create response
            response = ValidationResponse(
                issues=validation_result["issues"],
                summary=validation_result["summary"],
                score=validation_result["score"],
                suggestions=validation_result["suggestions"],
                word_count=validation_result["word_count"],
                issue_count=validation_result["issue_count"]
            )
            
            print(f"✅ Successfully created ValidationResponse")
            print(f"📊 Quality score: {response.score}")
            print(f"❌ Issues found: {response.issue_count}")
            logger.info(f"Successfully processed validation for document: {len(request.document)} chars")
            return response
            
        except Exception as e:
            print(f"❌ Error in process_validation: {str(e)}")
            print(f"❌ Error type: {type(e)}")
            import traceback
            print(f"❌ Full traceback: {traceback.format_exc()}")
            logger.error(f"Error processing validation: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process validation request: {str(e)}"
            )

# Create a singleton instance
validation_controller = ValidationController() 