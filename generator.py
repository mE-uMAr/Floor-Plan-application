import json
from PIL import Image, ImageDraw, ImageFont
from parser import safe_load_json
from groq_config import generate_floor_plan

def generate_img(user_input: str):
    plan_json = generate_floor_plan(user_input)
    print(plan_json)

    plan = safe_load_json(plan_json)

    canvas_size = tuple(plan["canvas_size"])
    img = Image.new("RGB", canvas_size, "white")
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 14)
    except:
        font = ImageFont.load_default()

    scale = 15 
    for room in plan.get("rooms", []):
        x, y, w, h = room["x"], room["y"], room["w"], room["h"]
        draw.rectangle([x, y, x + w, y + h], outline="black", width=4)

        width_ft = round(w / scale)
        height_ft = round(h / scale)
        label = f"{room['name']} ({width_ft}x{height_ft} ft)"

        draw.text((x + 5, y + 5), label, fill="black", font=font)

    for obj in plan.get("objects", []):
        x, y, w, h = obj["x"], obj["y"], obj["w"], obj["h"]

        obj_type = obj["type"].lower()
        color, outline = "grey", "black"
        if "bed" in obj_type:
            color, outline = "lightblue", "blue"
        elif "sofa" in obj_type:
            color, outline = "lightgreen", "green"
        elif "door" in obj_type:
            color, outline = "brown", "black"
        elif "window" in obj_type:
            color, outline = "skyblue", "black"

        draw.rectangle([x, y, x + w, y + h], fill=color, outline=outline)

        draw.text((x + 2, y + 2), obj["type"], fill="black", font=font)

    return img
