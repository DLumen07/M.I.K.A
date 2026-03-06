import re, json, html

filepath = r'c:\Users\daren de lumen\Downloads\ARALIN 2-20260304T133942Z-3-001\ARALIN 2\ARALIN2_AKTIBITI5.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the H5PIntegration JSON block
# The structure is: "jsonContent":"<escaped-json>"
# Use regex to extract the jsonContent value
match = re.search(r'"jsonContent"\s*:\s*"(.+?)"(?:\s*,\s*")', content, re.DOTALL)
if not match:
    # Alternative: find it by position
    print("Trying positional extraction...")
    idx = content.index('"jsonContent":"')
    start = idx + len('"jsonContent":"')
    # Look for the pattern that ends the jsonContent: ","
    # But we need to handle escaped quotes
    # Use json.decoder to help
    # Wrap in a simple JSON to let Python's json module handle escaping
    # Find the next unescaped quote
    sub = content[start:start+500000]  # should be enough
    # Use json to decode: prepend a quote
    try:
        decoded, end_idx = json.JSONDecoder().raw_decode('"' + sub)
        data = json.loads(decoded)
    except Exception as e:
        print(f"Error: {e}")
        # Print a sample
        print(repr(sub[:200]))
        raise
else:
    json_escaped = match.group(1)
    # The value is an escaped JSON string inside a JS string
    # Unescape: \" -> " and \\ -> \  
    json_str = json_escaped.replace('\\"', '"').replace('\\\\', '\\')
    data = json.loads(json_str)

questions = data.get('questions', [])
print(f"Total questions found: {len(questions)}\n")

for i, q in enumerate(questions, 1):
    params = q.get('params', {})
    question_text = params.get('question', '')
    correct = params.get('correct', '')
    
    clean_text = re.sub(r'<[^>]+>', '', question_text)
    clean_text = html.unescape(clean_text)
    
    answer = str(correct).lower()
    
    print(f"Q{i}: {clean_text}")
    print(f"    Correct Answer: {answer}")
    print()
