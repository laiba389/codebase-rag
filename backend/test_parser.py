from parser import parse_repo
chunks = parse_repo("uploaded_repo")
print(f"Total chunks: {len(chunks)}")
print("Sample chunk:")
print(chunks[0]["text"][:200])
print("From file:", chunks[0]["file"])