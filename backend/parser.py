import os
from pathlib import Path

SKIP_DIRS = {
    "node_modules",".git","__pycache__",
    ".next","dist","build",".venv","venv"
}
SKIP_EXTS = {
    ".png",".jpg",".jpeg",".gif",".svg",
    ".ico",".woff",".ttf",".pdf",".zip",
    ".lock",".min.js"
}
CODE_EXTS = {
    ".py",".js",".ts",".tsx",".jsx",
    ".java",".go",".rs",".cpp",".c",
    ".cs",".rb",".php",".md",".txt"
}

MAX_FILE_SIZE = 50 * 1024  # skip files larger than 50KB

def get_all_files(repo_path: str):
    files = []
    for root, dirs, filenames in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fname in filenames:
            path = Path(root) / fname
            if path.suffix in CODE_EXTS:
                if os.path.getsize(path) < MAX_FILE_SIZE:
                    files.append(str(path))
    return files

def chunk_file(file_path: str, chunk_size=600, overlap=50):
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception:
        return []
    if not content.strip():
        return []
    chunks = []
    start = 0
    while start < len(content):
        end = start + chunk_size
        chunk = content[start:end]
        chunks.append({
            "text": chunk,
            "file": file_path,
            "start_char": start
        })
        start += chunk_size - overlap
    return chunks


def parse_repo(repo_path: str):
    all_chunks = []
    files = get_all_files(repo_path)
    for f in files:
        all_chunks.extend(chunk_file(f))
    print(f"Parsed {len(files)} files → {len(all_chunks)} chunks")
    return all_chunks