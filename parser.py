import re, json

def safe_load_json(raw: str):
    raw = re.sub(r"^```json|```$", "", raw.strip(), flags=re.MULTILINE)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        fixed = raw.rstrip(", \n") + "]}}"
        return json.loads(fixed)