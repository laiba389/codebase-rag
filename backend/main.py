from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import zipfile, os, shutil
from pathlib import Path

app = FastAPI()
app.add_middleware(CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"])

UPLOAD_DIR = "uploaded_repo"

# Define ALL models at the top
class Question(BaseModel):
    query: str

class FileRequest(BaseModel):
    filename: str

SKIP_DIRS = {
    "node_modules", ".git", "__pycache__", ".next", "dist", "build",
    ".venv", "venv", ".idea", ".vscode", "coverage", ".pytest_cache"
}

SKIP_EXTS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2",
    ".ttf", ".eot", ".pdf", ".zip", ".tar", ".gz", ".7z", ".rar", ".exe",
    ".dll", ".so", ".dylib", ".pyc", ".pyd", ".db", ".sqlite", ".lock",
    ".min.js", ".min.css", ".map", ".mp4", ".mp3", ".pptx", ".ppt", ".key"
}

def should_extract_file(filename: str, size: int) -> bool:
    if size > 100 * 1024:
        return False
    parts = filename.replace("\\", "/").split("/")
    for part in parts[:-1]:
        if part in SKIP_DIRS:
            return False
    fname = parts[-1]
    if not fname:
        return False
    ext = os.path.splitext(fname)[1].lower()
    if ext in SKIP_EXTS:
        return False
    return True

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
    
    extracted_count = 0
    with zipfile.ZipFile(zip_path, "r") as z:
        for member in z.infolist():
            if member.is_dir():
                continue
            if should_extract_file(member.filename, member.file_size):
                z.extract(member, UPLOAD_DIR)
                extracted_count += 1
                
    if os.path.exists(zip_path):
        os.remove(zip_path)

    if extracted_count == 0:
        raise HTTPException(
            status_code=400,
            detail="No supported code or text files (.py, .js, .ts, .md, .txt, etc.) found in the uploaded ZIP archive."
        )

    return {"message": "Repo uploaded", "path": UPLOAD_DIR, "extracted_files": extracted_count}

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
        raise HTTPException(
            status_code=400,
            detail="No supported code or text files found in the uploaded archive."
        )
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