import os
from groq import Groq
from embedder import search
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def build_prompt(query, chunks):
    context = ""
    for c in chunks:
        fname = c["file"].split("/")[-1].split("\\")[-1]
        context += f"\n--- File: {fname} ---\n"
        context += c["text"] + "\n"
    return f"""You are a helpful assistant answering questions about a codebase.

Relevant code:
{context}

Question: {query}

Answer clearly and mention the filename(s) that were relevant."""

def ask(query, k=5):
    chunks = search(query, k=k)
    if not chunks:
        return {
            "answer": "No indexed code found. Upload and index a repo first.",
            "sources": [],
            "snippets": []
        }
    res = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role":"user","content":build_prompt(query,chunks)}],
        temperature=0.2
    )
    sources = list(set(
        c["file"].split("/")[-1].split("\\")[-1] for c in chunks
    ))
    snippets = [
        {
            "file": c["file"].split("/")[-1].split("\\")[-1],
            "text": c["text"][:300]
        }
        for c in chunks[:3]
    ]
    return {
        "answer": res.choices[0].message.content,
        "sources": sources,
        "snippets": snippets
    }