from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

groq_api_key = os.getenv("API_KEY")
system_command = """You are a floor-plan design parser. 
You are a JSON generator. Respond ONLY with valid JSON, no explanations, no markdown.
Your job is to translate natural language descriptions of rooms, furniture, and architectural elements into a strict JSON (no comments, no extra text) specification.

Rules:
1. Always output valid JSON only. No explanations or extra text.
2. Every plan must include a "canvas_size".
3. Each "room" is a rectangle with properties: name, x, y, w, h.
4. Each "object" (sofa, bed, door, window, table, etc.) has: type, room, x, y, w, h.
5. Coordinates (x, y) are the top-left corner; width (w) and height (h) are in pixels.
6. Default canvas_size is [800, 600] unless user specifies.
7. Use simple shapes; leave styling to renderer.
8. Never invent furniture unless mentioned.

Output format:
{
  "canvas_size": [width, height],
  "rooms": [
    {"name": "string", "x": int, "y": int, "w": int, "h": int}
  ],
  "objects": [
    {"type": "string", "room": "string", "x": int, "y": int, "w": int, "h": int}
  ]
}

Example:
{
  "canvas_size": [800, 600],
  "rooms": [
    {"id": 1, "name": "Bedroom", "x": 50, "y": 50, "w": 400, "h": 300, "dimensions": "12ft x 15ft"},
    {"id": 2, "name": "Living Room", "x": 50, "y": 370, "w": 400, "h": 200, "dimensions": "15ft x 20ft"}
  ],
  "objects": [
    {"type": "Queen Bed", "room": "Bedroom", "x": 100, "y": 80, "w": 200, "h": 100},
    {"type": "Sofa", "room": "Living Room", "x": 100, "y": 400, "w": 180, "h": 80},
    {"type": "Door", "room": "Bedroom", "x": 50, "y": 200, "w": 50, "h": 100}
  ]
}"""

client = Groq(api_key=groq_api_key)

def generate_floor_plan(user_message: str):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_command},
                {"role": "user", "content": user_message},
            ],
            temperature=0.7,
            max_completion_tokens=5000,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print("BadRequestError:", e)
        raise