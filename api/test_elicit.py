#!/usr/bin/env python3
"""
Simple test script for the elicitation endpoint.
Run this to test the API locally.
"""

import requests
import json

def test_elicit_endpoint():
    """Test the elicitation endpoint with a sample project idea."""
    
    # Test data
    test_idea = """
    I want to build a mobile app for a local restaurant that allows customers to:
    - Browse the menu
    - Place orders online
    - Track their order status
    - Pay through the app
    - Leave reviews and ratings
    """
    
    # API endpoint (assuming running on localhost:8000)
    url = "http://localhost:8000/api/elicit"
    
    # Request payload
    payload = {
        "idea": test_idea.strip()
    }
    
    try:
        print("Testing elicitation endpoint...")
        print(f"Project idea: {test_idea[:100]}...")
        print("-" * 50)
        
        # Make the request
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Success! Response received:")
            print(f"📝 Summary: {data.get('summary', 'N/A')}")
            print(f"❓ Questions generated: {len(data.get('questions', []))}")
            print(f"👥 Personas generated: {len(data.get('personas', []))}")
            print(f"📋 Next steps: {len(data.get('next_steps', []))}")
            
            # Show some sample questions
            if data.get('questions'):
                print("\n📝 Sample Questions:")
                for i, q in enumerate(data['questions'][:3], 1):
                    print(f"  {i}. [{q['category'].upper()}] {q['question']}")
            
            # Show personas
            if data.get('personas'):
                print("\n👥 User Personas:")
                for i, p in enumerate(data['personas'], 1):
                    print(f"  {i}. {p['name']} - {p['role']}")
                    print(f"     Goals: {', '.join(p['goals'][:2])}")
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the API server is running on localhost:8000")
        print("Run: python main.py")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

def test_health_endpoint():
    """Test the health check endpoint."""
    
    url = "http://localhost:8000/api/elicit/health"
    
    try:
        print("\nTesting health endpoint...")
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

if __name__ == "__main__":
    print("🧪 Testing Praxify Elicitation API")
    print("=" * 50)
    
    test_health_endpoint()
    test_elicit_endpoint()
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!") 