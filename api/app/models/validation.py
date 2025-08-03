from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class IssueType(str, Enum):
    AMBIGUITY = "ambiguity"
    INCOMPLETENESS = "incompleteness"
    VAGUENESS = "vagueness"
    TECHNICAL_DEBT = "technical_debt"
    BUSINESS_RISK = "business_risk"

class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ValidationIssue(BaseModel):
    type: IssueType = Field(..., description="Type of validation issue")
    severity: Severity = Field(..., description="Severity level of the issue")
    word_or_phrase: str = Field(..., description="The problematic word or phrase")
    context: str = Field(..., description="Context where the issue was found")
    suggestion: str = Field(..., description="Suggested improvement")
    line_number: Optional[int] = Field(None, description="Line number where issue was found")

class ValidationRequest(BaseModel):
    document: str = Field(
        ..., 
        description="The requirements document to validate",
        min_length=10,
        max_length=10000
    )
    focus_areas: Optional[List[str]] = Field(
        default=["ambiguity", "completeness", "clarity"],
        description="Areas to focus validation on"
    )

class ValidationResponse(BaseModel):
    issues: List[ValidationIssue] = Field(..., description="List of validation issues found")
    summary: str = Field(..., description="Brief summary of validation results")
    score: float = Field(..., description="Overall quality score (0-100)")
    suggestions: List[str] = Field(..., description="General improvement suggestions")
    word_count: int = Field(..., description="Total word count of document")
    issue_count: int = Field(..., description="Total number of issues found") 