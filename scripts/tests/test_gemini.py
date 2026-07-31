# File: test_gemini_updated.py

import google.generativeai as genai
import os

# ✅ Configure with your API key
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# ✅ Use the recommended long-lasting stable model
model = genai.GenerativeModel("gemini-flash-latest")

prompt = "Write the definition of artificialintelligenece in easy language but dicriptive about one paragraph"

response = model.generate_content(prompt)

print("Response from Gemini:")
print(response.text)
