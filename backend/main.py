from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import zipfile, os, shutil

app = FastAPI()
app.add_middleware(CORSMiddleware,
  allow_origins=["*"], allow_methods=["*"],
  allow_headers=["*"])

UPLOAD_DIR = "uploaded_repo"

# Define ALL models at the top
class Question(BaseModel):
    query: str

class FileRequest(BaseModel):
    filename: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/upload")
async def upload_repo(file: UploadFile = File(...)):
    if os.path.exists(UPLOAD_DIR):
        shutil.rmtree(UPLOAD_DIR)
    os.makedirs(UPLOAD_DIR)
    zip_path = f"{UPLOAD_DIR}/repo.zip"
    with open(zip_path, "wb") as f:
        f.write(await file.read())
    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(UPLOAD_DIR)
    os.remove(zip_path)
    return {"message": "Repo uploaded", "path": UPLOAD_DIR}

@app.post("/parse")
async def parse():
    from parser import parse_repo
    chunks = parse_repo(UPLOAD_DIR)
    return {
        "total_chunks": len(chunks),
        "sample": chunks[:2] if chunks else []
    }

@app.post("/index")
async def index_repo():
    from parser import parse_repo
    from embedder import build_index
    chunks = parse_repo(UPLOAD_DIR)
    if not chunks:
        return {"error": "No chunks found"}
    build_index(chunks)
    return {"indexed": len(chunks)}

@app.post("/ask")
async def ask_question(q: Question):
    from rag import ask as rag_ask
    return rag_ask(q.query)

@app.post("/explain-file")
async def explain_file(req: FileRequest):
    from rag import ask as rag_ask
    for root, dirs, files in os.walk(UPLOAD_DIR):
        dirs[:] = [d for d in dirs
                   if d not in ["node_modules", ".git"]]
        for f in files:
            if f == req.filename:
                path = os.path.join(root, f)
                with open(path, "r", errors="ignore") as fh:
                    content = fh.read()[:3000]
                return rag_ask(
                    f"Explain what this file does:\n\n{content}"
                )
    return {"answer": "File not found", "sources": []}