#!/usr/bin/env python3
"""
Setup script for spaCy NER model.
Run this to install spaCy and download the English model.
"""

import subprocess
import sys
import os

def install_spacy():
    """Install spaCy and download the English model."""
    print("🔧 Setting up spaCy for NER-enhanced validation...")
    
    try:
        # Install spaCy
        print("📦 Installing spaCy...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "spacy==3.7.2"])
        
        # Download English model
        print("🤖 Downloading English NER model...")
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
        
        # Test the installation
        print("🧪 Testing spaCy installation...")
        import spacy
        nlp = spacy.load("en_core_web_sm")
        
        # Test with a simple sentence
        doc = nlp("John Smith works at Microsoft.")
        entities = [(ent.text, ent.label_) for ent in doc.ents]
        
        print(f"✅ spaCy installation successful!")
        print(f"📊 Test entities found: {entities}")
        print(f"🤖 Model: {nlp.meta.get('name', 'Unknown')}")
        
    except Exception as e:
        print(f"❌ Error setting up spaCy: {str(e)}")
        print("💡 Try running: pip install spacy==3.7.2")
        print("💡 Then run: python -m spacy download en_core_web_sm")
        return False
    
    return True

if __name__ == "__main__":
    success = install_spacy()
    if success:
        print("\n🎉 spaCy setup completed successfully!")
        print("🚀 You can now run the validation service with NER capabilities.")
    else:
        print("\n❌ spaCy setup failed. Please check the error messages above.")
        sys.exit(1) 