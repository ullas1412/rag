from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

queries = [
    "What is the minimum attendance requirement at GEC Hassan?",
    "How to apply for SSP scholarship in Karnataka?",
    "Which companies visit GEC Hassan for campus placements?",
    "What is the recipe for chocolate cake?"  # Intended out-of-scope query
]

for q in queries:
    res = client.post('/api/chat', json={'query': q}).json()
    print("=" * 60)
    print("QUESTION:", q)
    print("GROUNDED:", res.get("grounded"))
    print("CONFIDENCE:", res.get("confidence"), "%")
    print("ANSWER:")
    print(res.get("answer"))
    print()

