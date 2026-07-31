import os
import google.generativeai as genai

# Configure API key
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

# List all available models
models = genai.list_models()
print("Available Models:")
for m in models:
    print(f"- {m.name}, supports: {m.supported_generation_methods}")
