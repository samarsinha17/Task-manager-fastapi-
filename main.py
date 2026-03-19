from typing import Union
import uvicorn

from routes import users, tasks
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.USERS_ROUTER, prefix="/api")
app.include_router(tasks.TASKS_ROUTER, prefix="/api")


@app.get("/")
async def home():
    return {"msg": "This is home"}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, port=5000, log_level="warning")