# Chapter 4: Implementing a GPT Model

## Assembling the Block
Now that we have the **Self-Attention** mechanism and the **Feed-Forward Network**, we can combine them into a Transformer Block. A GPT model is simply a stack of these blocks.

### The Transformer Block Structure
1.  **Layer Normalization**: Stabilizes learning.
2.  **Multi-Head Attention**: Multiple "heads" allow the model to focus on different aspects of language simultaneously (e.g., one head for syntax, one for semantics).
3.  **Residual Connection**: We add the input back to the output ($x + Layer(x)$) to help gradients flow during backpropagation.
4.  **Feed-Forward Network**: Processes the contextual information individually for each token.

> **Architecture Viz**
> Review the architecture diagram again. Notice the loop of `[Attention -> Norm -> FeedForward -> Norm]`. This pattern repeats $N$ times (e.g., 12 times for GPT-2 Small).

## Implementing the Model Class
We wrap everything in a generic `GPTModel` class.

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
