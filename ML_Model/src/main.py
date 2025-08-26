import sys
from preprocess import preprocess_image
from bill_extractor import extract_bill_details

def main(image_path):
    preprocessed_image = preprocess_image(image_path)
    
    # Extract data using Gemini API
    extracted_info = extract_bill_details(image_path)

    # Save the extracted data
    with open("output/extracted_data.json", "w") as f:
        json.dump(extracted_info, f, indent=4)
    
    print("Extracted Data:", extracted_info)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python main.py <image_path>")
    else:
        main(sys.argv[1])
