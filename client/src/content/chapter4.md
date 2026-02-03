# Chapter 4: Implementing a GPT Model

<!-- SHALLOW -->
## Building the Full Model 🏗️

We've learned about embeddings (Ch1), tokenization (Ch2), and attention (Ch3). Now let's stack them together into a complete GPT model!

### The Recipe
1. **Embeddings**: Convert token IDs → vectors
2. **Transformer Blocks** (repeat N times):
   - Self-Attention
   - Feed-Forward Network
3. **Output Head**: Convert vectors → word predictions

> **See the Architecture →**
> The diagram shows how data flows through the layers!

## The Code
<!-- /SHALLOW -->

<!-- DEEP -->
## Assembling the Transformer Block

Now that we have the **Self-Attention** mechanism and understand embeddings, we can combine them into a complete Transformer Block. A GPT model is simply a stack of these blocks (e.g., 12 blocks in GPT-2 Small, 96 in GPT-3).

### The Transformer Block Structure
Each block contains:
1.  **Layer Normalization**: Stabilizes training by normalizing activations
2.  **Multi-Head Attention**: Multiple attention heads running in parallel (e.g., 12 heads)
3.  **Residual Connection**: We add the input back to the output ($x + \text{Layer}(x)$) to help gradients flow during backpropagation
4.  **Feed-Forward Network**: A 2-layer MLP that processes each position independently
5.  **Another LayerNorm + Residual**: Applied after the feed-forward

> **Architecture Visualization**
> Review the architecture diagram again. Notice the loop of `[Attention → Norm → FeedForward → Norm]`. This pattern repeats $N$ times stacked vertically.

### Why Residual Connections Matter
Without residual connections, gradients would vanish when backpropagating through 100+ layers. The skip connection creates a "gradient highway" allowing direct paths from output to input.

### Feed-Forward Network Details
After gathering context via attention, each token's representation is processed independently through:
```
FFN(x) = max(0, xW₁ + b₁)W₂ + b₂
```
Typically, the hidden dimension is 4x larger than the model dimension (e.g., 768 → 3072 in GPT-2).

## Implementing the Model Class
<!-- /DEEP -->

```python
import numpy as np

class GPTModel:
    def __init__(self, vocab_size, d_model, n_head, n_layer):
        # 1. Embeddings (Randomly initialized)
        self.token_embedding = np.random.randn(vocab_size, d_model)
        self.pos_embedding = np.random.randn(1024, d_model)
        
        # 2. Layers (Simplified storage of weights)
        self.blocks = [
            {"w_attn": np.random.randn(d_model, d_model), "w_ff": np.random.randn(d_model, d_model)}
            for _ in range(n_layer)
        ]
        
        # 3. Final Head
        self.ln_f_scale = np.ones(d_model)
        self.ln_f_bias = np.zeros(d_model)
        self.head_w = np.random.randn(d_model, vocab_size)

    def forward(self, idx):
        # idx is a list of integers, e.g., [42, 101, 99]
        t = len(idx)
        
        # 1. Embeddings lookup & addition
        tok_emb = self.token_embedding[idx] # Shape (T, D)
        pos_emb = self.pos_embedding[:t]    # Shape (T, D)
        x = tok_emb + pos_emb
        
        # 2. Transformer Blocks (Simplified Pass)
        for block in self.blocks:
            # Mocking attention and FF processing
            # x = x + Attention(x) -> simple matrix mult for demo
            x = x + np.dot(x, block["w_attn"]) 
            # x = x + FeedForward(x)
            x = x + np.dot(x, block["w_ff"])
        
        # 3. Final Norm & Head
        # Simple LayerNorm simulation
        mean = np.mean(x, axis=-1, keepdims=True)
        std = np.std(x, axis=-1, keepdims=True)
        x = self.ln_f_scale * (x - mean) / (std + 1e-5) + self.ln_f_bias
        
        # Project to vocabulary size
        logits = np.dot(x, self.head_w)
        
        return logits

# Initialize and run
model = GPTModel(vocab_size=1000, d_model=16, n_head=4, n_layer=2)
input_ids = [42, 105, 10]
output = model.forward(input_ids)
print("Output logits shape:", output.shape)
```

<!-- DEEP -->

### Model Scaling: The Power of Size
| Model | Params | Layers | d_model | Heads | Context |
|-------|--------|--------|---------|-------|---------|
| GPT-2 Small | 117M | 12 | 768 | 12 | 1024 |
| GPT-2 Large | 774M | 36 | 1280 | 20 | 1024 |
| GPT-3 | 175B | 96 | 12288 | 96 | 2048 |

**Scaling Laws**: Model performance improves predictably with compute, data, and parameter count. Doubling model size requires ~10x more compute but yields consistent capability gains.

### Next Steps
In Chapter 5, we'll learn how to train this architecture from scratch on unlabeled text data using the next-token prediction objective.
<!-- /DEEP -->
