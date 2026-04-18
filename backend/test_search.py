from embedder import search

results = search("how does authentication work", k=3)
for r in results:
    print("FILE:", r["file"])
    print("TEXT:", r["text"][:150])
    print("---")