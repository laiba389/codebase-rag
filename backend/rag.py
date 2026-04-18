import ollama
from embedder import search

def build_prompt(query: str, chunks: list):
    context = ""
    for c in chunks:
        fname = c["file"].split("\\")[-1]
        context += f"\n--- File: {fname} ---\n"
        context += c["text"] + "\n"
    return f"""You are a helpful assistant that answers
questions about a codebase.

Here are the most relevant code snippets:
{context}

Question: {query}

Answer based on the code above. Mention the filename(s) that were relevant."""

def ask(query: str, k=5):
    chunks = search(query, k=k)
    if not chunks:
        return {
            "answer": "No indexed code found. Upload and index a repo first.",
            "sources": []
        }
    prompt = build_prompt(query, chunks)
    response = ollama.chat(
        model="llama3.2",
        messages=[{"role": "user", "content": prompt}]
    )
    sources = list(set(
        c["file"].split("\\")[-1] for c in chunks
    ))
    return {
        "answer": response["message"]["content"],
        "sources": sources
    }