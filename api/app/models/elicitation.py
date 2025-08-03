from pydantic import BaseModel, Field
from typing import List, Optional

class ElicitationRequest(BaseModel):
    idea: str = Field(
        ..., 
        description="The user's initial project idea or concept",
        min_length=10,
        max_length=2000
    )

class ClarifyingQuestion(BaseModel):
    question: str = Field(..., description="A clarifying question about the project")
    category: str = Field(..., description="Category of the question (e.g., 'functional', 'technical', 'business')")
    priority: str = Field(..., description="Priority level (high, medium, low)")

class UserPersona(BaseModel):
    name: str = Field(..., description="Name of the persona")
    role: str = Field(..., description="Role or job title")
    description: str = Field(..., description="Brief description of the persona")
    goals: List[str] = Field(..., description="List of goals for this persona")
    pain_points: List[str] = Field(..., description="List of pain points for this persona")

class ElicitationResponse(BaseModel):
    questions: List[ClarifyingQuestion] = Field(..., description="List of clarifying questions")
    personas: List[UserPersona] = Field(..., description="List of user personas")
    summary: str = Field(..., description="Brief summary of the analysis")
    next_steps: List[str] = Field(..., description="Recommended next steps") 