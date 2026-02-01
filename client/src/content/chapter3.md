# Chapter 3: Coding Attention Mechanisms

## The Heart of the Transformer
**Self-Attention** is the mechanism that makes Transformers unique. It allows the model to look at other words in the sentence to gather context for the current word.

### Query, Key, and Value
Think of it like a database retrieval:
*   **Query (Q)**: What I am looking for? (e.g., "bank" in "river bank")
*   **Key (K)**: What defining attributes do other tokens have? (e.g., "river" has attributes of water/nature)
*   **Value (V)**: The actual content/meaning of the token.

If the **Query** matches the **Key** (high similarity), we "attend" to that token's **Value**.

> **Visualization Panel: Attention Matrix**
> Look at the heatmap in the visualization panel.
> *   **Darker Blue squares** indicate stronger attention.
> *   Notice how "sat" might focus heavily on "The" and "cat" to know *who* sat.
> *   This matrix is essentially calculating how much every word relates to every other word.

## The Math
$$ Attention(Q, K, V) = softmax(\frac{QK^T}{\sqrt{d_k}})V $$

1.  **Dot Product ($QK^T$)**: Measures similarity between queries and keys.
2.  **Scale ($\sqrt{d_k}$)**: Prevents gradients from exploding.
3.  **Softmax**: Converts scores to probabilities (sum to 1).
4.  **MatMul with V**: Aggregates the relevant information.

## Code: Single-Head Attention
```python
import torch
import torch.nn.functional as F

torch.manual_seed(123)
d_in, d_out = 4, 8 # arbitrary dims

# Inputs
x = torch.randn(1, 5, d_in) # Batch=1, Seq=5, Dim=4
W_q = torch.nn.Parameter(torch.randn(d_in, d_out))
W_k = torch.nn.Parameter(torch.randn(d_in, d_out))
W_v = torch.nn.Parameter(torch.randn(d_in, d_out))

# Compute Q, K, V
Q = x @ W_q
K = x @ W_k
V = x @ W_v

# Attention Scores
scores = Q @ K.transpose(-2, -1)
weights = F.softmax(scores / (d_out**0.5), dim=-1)

# Context Vector
context = weights @ V

print("Attention Weights shape:", weights.shape)
print("Context Vector shape:", context.shape)
```
