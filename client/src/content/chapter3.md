# Chapter 3: Coding Attention Mechanisms

<!-- SHALLOW -->
## The Secret Sauce: Self-Attention 🔍

**Self-Attention** lets the model understand context. When reading "The cat sat on the mat," the model figures out that "sat" relates more to "cat" than to "mat."

### The Analogy
Think of it like a search engine:
- **Query (Q)**: "What am I looking for?"
- **Key (K)**: "What topics do others cover?"
- **Value (V)**: "The actual information"

If your query matches someone's key → you pay attention to their value!

> **Check the Heatmap →**
> The attention matrix shows which words "talk" to each other. Darker blue = stronger connection.

## Try the Code
<!-- /SHALLOW -->

<!-- DEEP -->
## The Heart of the Transformer

**Self-Attention** is the mechanism that makes Transformers unique. Unlike RNNs that process sequentially, attention computes relationships between all pairs of tokens in parallel, enabling:
- **Long-range dependencies**: Connect words 100+ tokens apart
- **Parallelization**: Process entire sequences simultaneously
- **Interpretability**: Visualize what the model "focuses" on

### Query, Key, and Value (The Database Analogy)
Think of it like a differentiable database retrieval system:
*   **Query (Q)**: What information am I seeking? (e.g., "bank" in "river bank")
*   **Key (K)**: What defining attributes do other tokens have? (e.g., "river" has attributes of water/nature)
*   **Value (V)**: The actual content/meaning to be retrieved

If the **Query** has high dot-product similarity with a **Key**, we "attend" strongly to that token's **Value**.

> **Visualization Panel: Attention Matrix**
> Look at the heatmap in the visualization panel.
> *   **Darker Blue squares** indicate stronger attention weights
> *   Notice how "sat" might focus heavily on "The" and "cat" to determine *who* performed the action
> *   This matrix is essentially a learned, soft routing mechanism showing how information flows between positions

## The Mathematics

The scaled dot-product attention mechanism is defined as:

$$ \text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V $$

**Breaking it down**:
1.  **Dot Product ($QK^T$)**: Measures similarity between all query-key pairs. Higher values = more relevant.
2.  **Scale ($\sqrt{d_k}$)**: Prevents gradients from vanishing when $d_k$ is large. Without this, softmax saturates.
3.  **Softmax**: Normalizes scores into a probability distribution (sums to 1 across the sequence).
4.  **Weighted Sum ($\times V$)**: Aggregates values based on attention weights, creating context-aware representations.

### Multi-Head Attention
In practice, we run multiple attention operations in parallel (e.g., 12 heads in GPT-2), allowing the model to attend to different aspects (syntax, semantics, coreference) simultaneously.

## Code: Single-Head Attention Implementation
<!-- /DEEP -->

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

<!-- DEEP -->

### Causal Attention (for Autoregressive Models)
In GPT-style models, we apply a **causal mask** to prevent positions from attending to future tokens. This enforces left-to-right generation:

```python
# Create causal mask (upper triangle set to -inf before softmax)
mask = np.triu(np.ones((5, 5)) * -1e9, k=1)
masked_scores = scores + mask
```

**Key Insight**: Attention is the fundamental operation that replaced recurrence in modern NLP. It's what makes LLMs work!
<!-- /DEEP -->
