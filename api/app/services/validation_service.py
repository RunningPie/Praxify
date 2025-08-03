import re
import logging
from typing import List, Dict, Any, Tuple
from app.models.validation import ValidationIssue, IssueType, Severity
import json
import spacy
from spacy.tokens import Doc

logger = logging.getLogger(__name__)

class ValidationService:
    def __init__(self):
        # Initialize spaCy NER model
        try:
            self.nlp = spacy.load("en_core_web_sm")
            print(f"✅ spaCy NER model loaded successfully")
        except OSError:
            print(f"⚠️ spaCy model not found. Installing...")
            import subprocess
            import sys
            subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
            print(f"✅ spaCy NER model installed and loaded")
        
        # Ambiguous keywords (vague terms that are too subjective for technical specs)
        self.ambiguous_words = {
            # Performance-related vague terms
            "fast", "quick", "soon", "efficient", "speedy", "rapid", "swift",
            "cepat", "mudah", "efisien", "baik", "bagus", "lancar",
            
            # User experience vague terms
            "user-friendly", "intuitive", "easy", "simple", "clear", "obvious",
            "mudah digunakan", "ramah pengguna", "sederhana", "jelas",
            
            # Quality vague terms
            "good", "great", "excellent", "high-quality", "robust", "reliable",
            "baik", "bagus", "berkualitas", "handal", "andal",
            
            # Scalability vague terms
            "scalable", "flexible", "modular", "extensible", "adaptable",
            "skalabel", "fleksibel", "modular", "dapat diperluas",
            
            # Security vague terms
            "secure", "safe", "protected", "secure", "aman", "terlindungi",
            
            # General vague terms
            "appropriate", "suitable", "adequate", "sufficient", "reasonable",
            "cocok", "sesuai", "cukup", "memadai", "wajar",
            
            # Uncertainty indicators
            "maybe", "possibly", "might", "could", "should", "would",
            "mungkin", "bisa jadi", "barangkali", "seharusnya",
            
            # Approximation terms
            "approximately", "around", "about", "roughly", "nearly",
            "sekitar", "kira-kira", "hampir", "kurang lebih"
        }
        
        # Vague phrases that indicate incompleteness
        self.vague_phrases = [
            r"\b(to be determined|TBD|tbd)\b",
            r"\b(to be decided|TBD|tbd)\b",
            r"\b(etc\.|etc|and so on)\b",
            r"\b(similar|related|other)\b",
            r"\b(appropriate|suitable|adequate)\b",
            r"\b(if needed|if required|if necessary)\b",
            r"\b(as needed|as required|as necessary)\b",
            r"\b(and others|and the like)\b",
            r"\b(dan lain-lain|dll)\b",
            r"\b(atau sejenisnya|dan sebagainya)\b"
        ]
        
        # Technical debt indicators
        self.technical_debt_indicators = [
            r"\b(temporary|temp|workaround|quick fix)\b",
            r"\b(legacy|old|deprecated)\b",
            r"\b(manual|manual process)\b",
            r"\b(not optimized|not efficient)\b",
            r"\b(sementara|workaround|perbaikan cepat)\b",
            r"\b(warisan|lama|usang)\b",
            r"\b(manual|proses manual)\b"
        ]
        
        # Business risk indicators
        self.business_risk_indicators = [
            r"\b(assume|assumption)\b",
            r"\b(depends on|dependency)\b",
            r"\b(if available|if possible)\b",
            r"\b(subject to|pending)\b",
            r"\b(berasumsi|asumsi)\b",
            r"\b(bergantung pada|ketergantungan)\b",
            r"\b(jika tersedia|jika memungkinkan)\b"
        ]
        
        # Required sections for completeness check
        self.required_sections = {
            "users": [
                r"\b(user|users|pengguna)\b",
                r"\b(stakeholder|pemangku kepentingan)\b",
                r"\b(actor|aktor)\b"
            ],
            "goals": [
                r"\b(goal|goals|objective|objectives|tujuan)\b",
                r"\b(purpose|maksud)\b",
                r"\b(aim|target|target)\b"
            ],
            "features": [
                r"\b(feature|features|fitur)\b",
                r"\b(functionality|fungsi)\b",
                r"\b(capability|kemampuan)\b"
            ],
            "requirements": [
                r"\b(requirement|requirements|kebutuhan)\b",
                r"\b(need|needs|perlu)\b",
                r"\b(must|should|shall|harus)\b"
            ]
        }
        
        print(f"🔧 Initializing ValidationService...")
        print(f"📝 Loaded {len(self.ambiguous_words)} ambiguous words")
        print(f"📝 Loaded {len(self.vague_phrases)} vague phrase patterns")
        print(f"📝 Loaded {len(self.required_sections)} required section patterns")
        print(f"🤖 NER model: {self.nlp.meta.get('name', 'Unknown')}")
        print(f"✅ ValidationService initialized successfully")
    
    def validate_document(self, document: str, focus_areas: List[str] = None) -> Dict[str, Any]:
        """
        Validate a requirements document for various quality issues using classic CS rule-based techniques.
        
        Args:
            document (str): The document to validate
            focus_areas (List[str]): Areas to focus on (ambiguity, completeness, clarity, etc.)
            
        Returns:
            Dict containing validation results
        """
        try:
            print(f"🔍 Starting document validation...")
            print(f"📄 Document length: {len(document)} characters")
            print(f"🎯 Focus areas: {focus_areas}")
            
            # Rule-based validation using classic CS pattern matching
            issues = self._rule_based_validation(document)
            print(f"✅ Rule-based validation found {len(issues)} issues")
            
            # NER-enhanced validation
            ner_issues = self._ner_enhanced_validation(document)
            print(f"✅ NER-enhanced validation found {len(ner_issues)} issues")
            
            # Completeness check
            completeness_issues = self._completeness_check(document)
            print(f"✅ Completeness check found {len(completeness_issues)} issues")
            
            # Combine all issues
            all_issues = issues + ner_issues + completeness_issues
            print(f"✅ Total validation found {len(all_issues)} issues")
            
            # Calculate quality score
            score = self._calculate_quality_score(document, all_issues)
            print(f"📊 Quality score: {score}")
            
            # Generate summary and suggestions
            summary = self._generate_summary(all_issues, score)
            suggestions = self._generate_suggestions(all_issues)
            
            return {
                "issues": all_issues,
                "summary": summary,
                "score": score,
                "suggestions": suggestions,
                "word_count": len(document.split()),
                "issue_count": len(all_issues)
            }
            
        except Exception as e:
            print(f"❌ Error in validate_document: {str(e)}")
            print(f"❌ Error type: {type(e)}")
            import traceback
            print(f"❌ Full traceback: {traceback.format_exc()}")
            logger.error(f"Error validating document: {str(e)}")
            raise Exception(f"Failed to validate document: {str(e)}")
    
    def _rule_based_validation(self, document: str) -> List[ValidationIssue]:
        """Perform rule-based validation using classic CS pattern matching techniques."""
        issues = []
        lines = document.split('\n')
        
        print(f"🔍 Performing rule-based validation...")
        
        for line_num, line in enumerate(lines, 1):
            # Check for ambiguous words
            for word in self.ambiguous_words:
                if re.search(rf'\b{re.escape(word)}\b', line, re.IGNORECASE):
                    # Generate specific suggestions based on word type
                    suggestion = self._generate_ambiguity_suggestion(word)
                    issues.append(ValidationIssue(
                        type=IssueType.AMBIGUITY,
                        severity=Severity.MEDIUM,
                        word_or_phrase=word,
                        context=line.strip(),
                        suggestion=suggestion,
                        line_number=line_num
                    ))
            
            # Check for vague phrases
            for pattern in self.vague_phrases:
                matches = re.finditer(pattern, line, re.IGNORECASE)
                for match in matches:
                    issues.append(ValidationIssue(
                        type=IssueType.VAGUENESS,
                        severity=Severity.HIGH,
                        word_or_phrase=match.group(),
                        context=line.strip(),
                        suggestion="Provide specific details instead of vague terms",
                        line_number=line_num
                    ))
            
            # Check for technical debt indicators
            for pattern in self.technical_debt_indicators:
                matches = re.finditer(pattern, line, re.IGNORECASE)
                for match in matches:
                    issues.append(ValidationIssue(
                        type=IssueType.TECHNICAL_DEBT,
                        severity=Severity.MEDIUM,
                        word_or_phrase=match.group(),
                        context=line.strip(),
                        suggestion="Consider long-term implications and proper solutions",
                        line_number=line_num
                    ))
            
            # Check for business risk indicators
            for pattern in self.business_risk_indicators:
                matches = re.finditer(pattern, line, re.IGNORECASE)
                for match in matches:
                    issues.append(ValidationIssue(
                        type=IssueType.BUSINESS_RISK,
                        severity=Severity.HIGH,
                        word_or_phrase=match.group(),
                        context=line.strip(),
                        suggestion="Clarify dependencies and assumptions",
                        line_number=line_num
                    ))
        
        print(f"📊 Rule-based validation completed: {len(issues)} issues found")
        return issues
    
    def _ner_enhanced_validation(self, document: str) -> List[ValidationIssue]:
        """Perform NER-enhanced validation using spaCy."""
        issues = []
        
        print(f"🔍 Performing NER-enhanced validation...")
        
        # Process document with spaCy
        doc = self.nlp(document)
        
        # Extract entities and their context
        entities = self._extract_entities(doc)
        print(f"📊 Found {len(entities)} entities in document")
        
        # Analyze entities for validation issues
        for entity in entities:
            issue = self._analyze_entity_for_issues(entity, doc)
            if issue:
                issues.append(issue)
        
        # Check for entity-related patterns
        entity_pattern_issues = self._check_entity_patterns(doc)
        issues.extend(entity_pattern_issues)
        
        print(f"📊 NER-enhanced validation completed: {len(issues)} issues found")
        return issues
    
    def _extract_entities(self, doc: Doc) -> List[Dict[str, Any]]:
        """Extract named entities from the document."""
        entities = []
        
        for ent in doc.ents:
            entities.append({
                "text": ent.text,
                "label": ent.label_,
                "start": ent.start_char,
                "end": ent.end_char,
                "context": ent.sent.text.strip()
            })
        
        return entities
    
    def _analyze_entity_for_issues(self, entity: Dict[str, Any], doc: Doc) -> ValidationIssue:
        """Analyze an entity for potential validation issues."""
        text = entity["text"]
        label = entity["label"]
        context = entity["context"]
        
        # Check for vague entity descriptions
        if label in ["PERSON", "ORG", "PRODUCT"]:
            # Look for vague modifiers around the entity
            vague_modifiers = ["appropriate", "suitable", "good", "proper", "correct"]
            for modifier in vague_modifiers:
                if modifier.lower() in context.lower():
                    return ValidationIssue(
                        type=IssueType.VAGUENESS,
                        severity=Severity.MEDIUM,
                        word_or_phrase=f"{modifier} {text}",
                        context=context,
                        suggestion=f"Specify what makes {text} appropriate/suitable (e.g., 'experienced in Python development', 'certified in AWS')",
                        line_number=None
                    )
        
        # Check for missing specificity in technical entities
        if label in ["PRODUCT", "ORG"]:
            if any(word in context.lower() for word in ["system", "platform", "tool"]):
                if not any(word in context.lower() for word in ["version", "specific", "particular", "version"]):
                    return ValidationIssue(
                        type=IssueType.INCOMPLETENESS,
                        severity=Severity.MEDIUM,
                        word_or_phrase=text,
                        context=context,
                        suggestion=f"Specify version or specific details for {text} (e.g., 'Python 3.11', 'AWS Lambda')",
                        line_number=None
                    )
        
        return None
    
    def _check_entity_patterns(self, doc: Doc) -> List[ValidationIssue]:
        """Check for problematic patterns involving entities."""
        issues = []
        
        # Check for "the system" without proper context
        for sent in doc.sents:
            sent_text = sent.text.lower()
            if "the system" in sent_text and len(sent_text.split()) < 10:
                # Look for vague descriptions
                vague_words = ["should", "must", "will", "can", "may"]
                for word in vague_words:
                    if f"{word} be" in sent_text:
                        issues.append(ValidationIssue(
                            type=IssueType.VAGUENESS,
                            severity=Severity.HIGH,
                            word_or_phrase="the system",
                            context=sent.text.strip(),
                            suggestion="Specify which system component and what behavior is expected",
                            line_number=None
                        ))
                        break
        
        # Check for missing stakeholder identification
        person_entities = [ent for ent in doc.ents if ent.label_ == "PERSON"]
        if not person_entities and any(word in doc.text.lower() for word in ["user", "admin", "manager"]):
            issues.append(ValidationIssue(
                type=IssueType.INCOMPLETENESS,
                severity=Severity.MEDIUM,
                word_or_phrase="stakeholder identification",
                context="Document structure",
                suggestion="Identify specific stakeholders by name or role (e.g., 'System Administrator', 'End Users')",
                line_number=None
            ))
        
        return issues
    
    def _generate_ambiguity_suggestion(self, word: str) -> str:
        """Generate specific suggestions for ambiguous words."""
        word_lower = word.lower()
        
        # Performance-related suggestions
        if word_lower in ["fast", "quick", "cepat", "efisien"]:
            return f"Replace '{word}' with specific metrics (e.g., 'loads in under 2 seconds', 'processes 1000 records per minute')"
        
        # User experience suggestions
        elif word_lower in ["user-friendly", "intuitive", "mudah digunakan", "ramah pengguna"]:
            return f"Replace '{word}' with specific UX criteria (e.g., 'completable in 3 clicks', 'requires no training')"
        
        # Quality suggestions
        elif word_lower in ["good", "great", "baik", "bagus"]:
            return f"Replace '{word}' with measurable quality standards (e.g., '99.9% uptime', 'zero data loss')"
        
        # Scalability suggestions
        elif word_lower in ["scalable", "skalabel", "fleksibel"]:
            return f"Replace '{word}' with specific scalability requirements (e.g., 'supports 10,000 concurrent users', 'handles 1TB data')"
        
        # Security suggestions
        elif word_lower in ["secure", "safe", "aman"]:
            return f"Replace '{word}' with specific security measures (e.g., 'encrypted at rest', 'SOC2 compliant')"
        
        # General vague terms
        else:
            return f"Replace '{word}' with specific, measurable criteria"
    
    def _completeness_check(self, document: str) -> List[ValidationIssue]:
        """Check if basic sections have been described (completeness check)."""
        issues = []
        
        print(f"🔍 Performing completeness check...")
        
        # Check each required section
        for section_name, patterns in self.required_sections.items():
            section_found = False
            
            for pattern in patterns:
                if re.search(pattern, document, re.IGNORECASE):
                    section_found = True
                    break
            
            if not section_found:
                issues.append(ValidationIssue(
                    type=IssueType.INCOMPLETENESS,
                    severity=Severity.HIGH,
                    word_or_phrase=f"Missing {section_name} section",
                    context="Document structure",
                    suggestion=f"Add a section describing {section_name} and their requirements",
                    line_number=None
                ))
        
        print(f"📊 Completeness check completed: {len(issues)} missing sections found")
        return issues
    

    
    def _calculate_quality_score(self, document: str, issues: List[ValidationIssue]) -> float:
        """Calculate overall quality score (0-100)."""
        if not document.strip():
            return 0.0
        
        # Base score starts at 100
        score = 100.0
        
        # Deduct points based on issue severity and frequency
        severity_weights = {
            Severity.LOW: 1,
            Severity.MEDIUM: 3,
            Severity.HIGH: 5,
            Severity.CRITICAL: 10
        }
        
        total_deduction = 0
        for issue in issues:
            deduction = severity_weights.get(issue.severity, 1)
            total_deduction += deduction
        
        # Calculate score (minimum 0)
        score = max(0.0, score - total_deduction)
        
        # Normalize to 0-100 range
        score = min(100.0, score)
        
        return round(score, 1)
    
    def _generate_summary(self, issues: List[ValidationIssue], score: float) -> str:
        """Generate a summary of validation results."""
        if not issues:
            return f"Excellent! Your document has a quality score of {score}/100 with no issues found."
        
        issue_types = {}
        for issue in issues:
            issue_types[issue.type.value] = issue_types.get(issue.type.value, 0) + 1
        
        summary_parts = [f"Quality score: {score}/100"]
        
        if issue_types:
            type_summary = ", ".join([f"{count} {issue_type}" for issue_type, count in issue_types.items()])
            summary_parts.append(f"Issues found: {len(issues)} ({type_summary})")
        
        if score < 50:
            summary_parts.append("Significant improvements needed.")
        elif score < 75:
            summary_parts.append("Some improvements recommended.")
        else:
            summary_parts.append("Good quality with minor improvements possible.")
        
        return " ".join(summary_parts)
    
    def _generate_suggestions(self, issues: List[ValidationIssue]) -> List[str]:
        """Generate general improvement suggestions."""
        suggestions = []
        
        if not issues:
            suggestions.append("Great job! Your document is well-written and clear.")
            return suggestions
        
        # Group issues by type for targeted suggestions
        issue_types = {}
        for issue in issues:
            if issue.type not in issue_types:
                issue_types[issue.type] = []
            issue_types[issue.type].append(issue)
        
        # Generate type-specific suggestions
        if IssueType.AMBIGUITY in issue_types:
            suggestions.append("Replace ambiguous terms with specific, measurable criteria.")
        
        if IssueType.INCOMPLETENESS in issue_types:
            suggestions.append("Add missing details like goals, acceptance criteria, and features.")
        
        if IssueType.VAGUENESS in issue_types:
            suggestions.append("Use precise language and avoid vague phrases like 'etc.' or 'and so on'.")
        
        if IssueType.TECHNICAL_DEBT in issue_types:
            suggestions.append("Consider long-term implications and avoid temporary solutions.")
        
        if IssueType.BUSINESS_RISK in issue_types:
            suggestions.append("Clarify dependencies, assumptions, and business constraints.")
        
        # NER-enhanced suggestions
        ner_issues = [issue for issue in issues if hasattr(issue, 'context') and any(entity in issue.context for entity in ['PERSON', 'ORG', 'PRODUCT'])]
        if ner_issues:
            suggestions.append("Specify version numbers, qualifications, and specific details for mentioned entities (people, organizations, products).")
        
        # General suggestions
        if len(issues) > 10:
            suggestions.append("Consider breaking down complex requirements into smaller, more specific items.")
        
        if any(issue.severity == Severity.CRITICAL for issue in issues):
            suggestions.append("Address critical issues first as they may impact project success.")
        
        return suggestions

# Create a singleton instance
validation_service = ValidationService() 