import io, base64
from fastapi import FastAPI, Body
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from generator import generate_img
from PIL import Image
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

class PromptRequest(BaseModel):
    prompt: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"], 
    allow_credentials=True, 
    allow_methods=["*"],    
    allow_headers=["*"],     
)


@app.post("/get_plan")
def generate_floor(req: PromptRequest):
    img: Image.Image = generate_img(req.prompt)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png")

@app.get("/ping")
def ping():
    return {
        "success" : True
    }
