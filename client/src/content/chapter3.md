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
import numpy as np

np.random.seed(123)
d_in, d_out = 4, 8

# Inputs: Batch=1, Seq=5, Dim=4
x = np.random.randn(1, 5, d_in)

# Weight Matrices
W_q = np.random.randn(d_in, d_out)
W_k = np.random.randn(d_in, d_out)
W_v = np.random.randn(d_in, d_out)

# Compute Q, K, V
# x is (1, 5, 4), W is (4, 8) -> Result (1, 5, 8)
Q = x @ W_q
K = x @ W_k
V = x @ W_v

# Softmax Helper Function
def softmax(x):
    e_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return e_x / e_x.sum(axis=-1, keepdims=True)

# Attention Scores
# Q is (1, 5, 8), K is (1, 5, 8). We need K transposed to (1, 8, 5)
# swapaxes(-2, -1) swaps the last two dimensions
scores = Q @ K.swapaxes(-2, -1)
weights = softmax(scores / np.sqrt(d_out))

# Context Vector
context = weights @ V

print("Attention Weights shape:", weights.shape)
print("Context Vector shape:", context.shape)
```
