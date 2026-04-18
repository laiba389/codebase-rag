import os
import faiss, pickle, numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')  # downloads once, ~90MB
INDEX_PATH = "faiss_index.pkl"

def get_embedding(text: str):
    return model.encode(text).tolist()

def build_index(chunks: list):
    print(f"Embedding {len(chunks)} chunks...")
    texts = [c["text"] for c in chunks]
    embeddings = model.encode(texts, show_progress_bar=True)
    vecs = np.array(embeddings, dtype="float32")
    dim = vecs.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(vecs)
    with open(INDEX_PATH, "wb") as f:
        pickle.dump({"index": index,
                     "chunks": chunks,
                     "dim": dim}, f)
    print("Index saved!")
    return index, chunks

def load_index():
    if not os.path.exists(INDEX_PATH):
        return None, []
    with open(INDEX_PATH, "rb") as f:
        data = pickle.load(f)
    return data["index"], data["chunks"]

def search(query: str, k=5):
    import os
    index, chunks = load_index()
    if index is None: return []
    q_vec = np.array([get_embedding(query)], dtype="float32")
    distances, indices = index.search(q_vec, k)
    return [chunks[i] for i in indices[0] if i < len(chunks)]