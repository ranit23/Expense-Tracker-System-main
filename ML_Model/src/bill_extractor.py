import base64
import os
from google import genai
from google.genai import types
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

def encode_image(image_path):
    """Convert image to base64 encoding for API request."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def extract_bill_details(image_path):
    """Use Gemini API to extract bill details."""
    client = genai.Client(api_key=GEMINI_API_KEY)
    image_data = encode_image(image_path)

    prompt = """
    Extract the following details from the bill image:
    - Vendor Name
    - Bill Date
    - Total Amount
    - GST Details (if available)
    - Itemized List (if available)
    Return the data in JSON format.
    """

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt),
                types.Part.from_data(data=base64.b64decode(image_data), mime_type="image/jpeg")
            ],
        )
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=0.7,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
        response_mime_type="application/json",
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=contents,
        config=generate_content_config,
    )

    return response.text  # The extracted JSON output
