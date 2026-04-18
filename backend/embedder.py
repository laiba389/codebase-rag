import os
import faiss
import pickle
import numpy as np
from dotenv import load_dotenv
load_dotenv()

INDEX_PATH = "faiss_index.pkl"

def get_embedding(text: str):
    from groq import Groq
    # Use simple hash-based embedding as fallback
    # Actually use sentence via API
    pass

# Use TF-IDF style lightweight embeddings
from sklearn.feature_extraction.text import TfidfVectorizer
import scipy.sparse as sp

vectorizer = None

def build_index(chunks: list):
    global vectorizer
    print(f"Indexing {len(chunks)} chunks with TF-IDF...")
    texts = [c["text"] for c in chunks]
    vectorizer = TfidfVectorizer(max_features=768)
    vecs = vectorizer.fit_transform(texts).toarray().astype("float32")
    dim = vecs.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(vecs)
    with open(INDEX_PATH, "wb") as f:
        pickle.dump({"index": index, "chunks": chunks,
                     "vectorizer": vectorizer}, f)
    print("Index saved!")
    return index, chunks

def load_index():
    global vectorizer
    if not os.path.exists(INDEX_PATH):
        return None, []
    with open(INDEX_PATH, "rb") as f:
        data = pickle.load(f)
    vectorizer = data["vectorizer"]
    return data["index"], data["chunks"]

def search(query: str, k=5):
    index, chunks = load_index()
    if index is None or vectorizer is None:
        return []
    q_vec = vectorizer.transform([query]).toarray().astype("float32")
    distances, indices = index.search(q_vec, k)
    return [chunks[i] for i in indices[0] if i < len(chunks)]