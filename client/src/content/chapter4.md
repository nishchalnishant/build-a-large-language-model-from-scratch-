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
import torch
import torch.nn as nn

class GPTModel(nn.Module):
    def __init__(self, vocab_size, d_model, n_head, n_layer):
        super().__init__()
        self.token_embedding = nn.Embedding(vocab_size, d_model)
        self.pos_embedding = nn.Embedding(1024, d_model)
        
        self.blocks = nn.Sequential(*[
            TransformerBlock(d_model, n_head) 
            for _ in range(n_layer)
        ])
        
        self.ln_f = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size, bias=False)

    def forward(self, idx):
        b, t = idx.size()
        
        # 1. Embeddings
        tok_emb = self.token_embedding(idx)
        pos_emb = self.pos_embedding(torch.arange(t, device=idx.device))
        x = tok_emb + pos_emb
        
        # 2. Transformer Blocks
        x = self.blocks(x)
        
        # 3. Final Norm & Head
        x = self.ln_f(x)
        logits = self.head(x)
        
        return logits
```
