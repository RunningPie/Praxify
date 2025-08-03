#!/usr/bin/env python3
"""
Simple test script for the validation endpoint.
Run this to test the API locally.
"""

import requests
import json

def test_validation_endpoint():
    """Test the validation endpoint with a sample document."""
    
    # Test data with known issues (including Indonesian terms and NER test cases)
    test_document = """
    The system should be fast and user-friendly.
    Users can access the data when needed.
    The application should handle errors appropriately.
    Performance should be good under normal conditions.
    The system will be scalable and reliable.
    We need to implement this feature soon.
    The interface should be intuitive and easy to use.
    Data processing should be efficient and quick.
    The system must be secure and robust.
    Users can perform actions as needed.
    
    John Smith should be the appropriate administrator.
    The system will use Python for development.
    Microsoft Azure will be the cloud platform.
    The database should be good for our needs.
    
    Sistem harus cepat dan mudah digunakan.
    Pengguna dapat mengakses data ketika diperlukan.
    Aplikasi harus menangani error dengan baik.
    Performa harus bagus dalam kondisi normal.
    Sistem akan skalabel dan handal.
    """
    
    # API endpoint (assuming running on localhost:8000)
    url = "http://localhost:8000/api/validate"
    
    # Request payload
    payload = {
        "document": test_document.strip(),
        "focus_areas": ["ambiguity", "completeness", "clarity"]
    }
    
    try:
        print("Testing validation endpoint...")
        print(f"Document length: {len(test_document)} characters")
        print("-" * 50)
        
        # Make the request
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Success! Response received:")
            print(f"📊 Quality score: {data.get('score', 'N/A')}")
            print(f"❌ Issues found: {data.get('issue_count', 'N/A')}")
            print(f"📝 Summary: {data.get('summary', 'N/A')}")
            print(f"📄 Word count: {data.get('word_count', 'N/A')}")
            
            # Show some sample issues
            if data.get('issues'):
                print(f"\n📋 Sample Issues:")
                for i, issue in enumerate(data['issues'][:3], 1):
                    print(f"  {i}. [{issue['type'].upper()}] {issue['word_or_phrase']}")
                    print(f"     Severity: {issue['severity']}")
                    print(f"     Suggestion: {issue['suggestion']}")
            
            # Show suggestions
            if data.get('suggestions'):
                print(f"\n💡 General Suggestions:")
                for i, suggestion in enumerate(data['suggestions'], 1):
                    print(f"  {i}. {suggestion}")
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the API server is running on localhost:8000")
        print("Run: python main.py")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

def test_validation_health_endpoint():
    """Test the validation health check endpoint."""
    
    url = "http://localhost:8000/api/validate/health"
    
    try:
        print("\nTesting validation health endpoint...")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the API server is running")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

def test_validation_test_endpoint():
    """Test the validation test endpoint."""
    
    url = "http://localhost:8000/api/validate/test"
    
    try:
        print("\nTesting validation test endpoint...")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Test passed: {data}")
        else:
            print(f"❌ Test failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the API server is running")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    print("🧪 Testing Praxify Validation API")
    print("=" * 50)
    
    test_validation_health_endpoint()
    test_validation_test_endpoint()
    test_validation_endpoint()
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!") 