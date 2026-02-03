# Chapter 8: Transformer Architectures Deep Dive

<!-- SHALLOW -->
## Understanding Transformer Variants 🔄

You've learned about the GPT architecture, but there are actually **three main types** of transformers, each designed for different tasks!

### The Three Families
1. **Decoder-Only** (GPT) 🤖
   - One-way attention (left-to-right)
   - Best for: Text generation, chat
   - Examples: GPT-3, GPT-4, LLaMA

2. **Encoder-Only** (BERT) 📖
   - Two-way attention (can see whole sentence)
   - Best for: Classification, understanding
   - Examples: BERT, RoBERTa

3. **Encoder-Decoder** (T5) 🔀
   - Combines both!
   - Best for: Translation, summarization
   - Examples: T5, BART

> **Architecture Diagram →**
> See how these three variants differ in structure!

## When to Use Which?
- **Decoder**: "Complete this sentence: The cat sat on..."
- **Encoder**: "Is this email spam? Yes/No"
- **Encoder-Decoder**: "Translate to French: Hello world"

<!-- /SHALLOW -->

<!-- DEEP -->
## Transformer Architecture Taxonomy

The original 2017 "Attention is All You Need" paper introduced the encoder-decoder architecture. Since then, the field has evolved into three distinct architectural families, each optimized for different task categories.

### Architectural Differences

The key distinction lies in the **attention masking** and **bidirectionality**:

| Architecture | Attention Type | Bidirectional | Primary Use Case | Training Objective |
|--------------|----------------|---------------|------------------|-------------------|
| **Encoder-Only** | Full (bilateral) | ✅ Yes | Understanding | Masked Language Modeling |
| **Decoder-Only** | Causal (masked) | ❌ No | Generation | Next Token Prediction |
| **Encoder-Decoder** | Both | ✅/❌ Hybrid | Sequence-to-Sequence | Span Corruption / Denoising |

### 1. Decoder-Only Transformers (GPT Family)

**Architecture**: Stack of decoder blocks with causal self-attention

**Key Characteristic**: Each token can only attend to previous tokens (left-to-right), enforcing autoregressive generation.

**Attention Masking**:
```
Token 1: sees [1]
Token 2: sees [1, 2]
Token 3: sees [1, 2, 3]
Token 4: sees [1, 2, 3, 4]
```

**Training**: Next-token prediction on large text corpora

**Models**: GPT-2, GPT-3, GPT-4, LLaMA, Mistral, Falcon

**Strengths**:
- Excellent for open-ended generation
- Few-shot learning capabilities
- Can be prompted for various tasks

**Weaknesses**:
- Cannot use future context for understanding tasks
- Less efficient for classification (needs entire sequence)

#### Mathematical Formulation

**Causal Self-Attention** with masking:

```
Attention(Q, K, V) = softmax((Q·K^T + M) / sqrt(d_k)) · V
```

Where the causal mask `M` is defined as:
- `M[i,j] = 0` if `i >= j` (can see current and past)
- `M[i,j] = -∞` if `i < j` (cannot see future)

This ensures position `i` can only attend to positions `j <= i` (no looking ahead).

**Complete Forward Pass**:

For input sequence `x = [x_1, x_2, ..., x_T]`:

1. **Token + Positional Embeddings**:
   ```
   h^(0)_t = E_token[x_t] + E_pos[t]
   ```

2. **Layer Processing** (for each of L layers):
   ```
   # Self-attention with residual + LayerNorm
   h_temp = LayerNorm(h^(l-1) + MultiHeadAttn(h^(l-1)))
   
   # Feed-forward with residual + LayerNorm  
   h^(l) = LayerNorm(h_temp + FFN(h_temp))
   ```

3. **Output Projection**:
   ```
   p(x_{t+1} | x_{1:t}) = softmax(W_out · h^(L)_t + b)
   ```

**Feed-Forward Network**:
```
FFN(x) = W_2 · ReLU(W_1 · x + b_1) + b_2
```

Typically, `d_ff = 4 × d_model` (e.g., 768 → 3072).

### 2. Encoder-Only Transformers (BERT Family)

**Architecture**: Stack of encoder blocks with bidirectional self-attention

**Key Characteristic**: Each token attends to ALL other tokens (left and right), enabling full context understanding.

**Attention Masking**:
```
Token 1: sees [1, 2, 3, 4]
Token 2: sees [1, 2, 3, 4]
Token 3: sees [1, 2, 3, 4]
Token 4: sees [1, 2, 3, 4]
```

**Training**: Masked Language Modeling (MLM) - predict randomly masked tokens

**Models**: BERT, RoBERTa, ALBERT, DistilBERT, DeBERTa

**Strengths**:
- Superior for understanding and classification tasks
- Bidirectional context improves quality
- Efficient fine-tuning for downstream tasks

**Weaknesses**:
- Cannot generate text autoregressively
- Requires task-specific heads for each application

#### Mathematical Formulation

**Bidirectional Self-Attention** (no causal mask):

```
Attention(Q, K, V) = softmax(Q·K^T / sqrt(d_k)) · V
```

Every token attends to all tokens in the sequence. The attention matrix `A` is fully populated (no masking).

**Masked Language Modeling Objective**:

Given input `x = [x_1, x_2, ..., x_T]`, randomly mask 15% of tokens:
- Replace with `[MASK]` token with 80% probability
- Replace with random token with 10% probability  
- Keep original with 10% probability

Training objective: predict the original masked tokens using bidirectional context.

**Classification Head**:

For downstream tasks, extract the `[CLS]` token representation:
```
h_[CLS] = h^(L)_0  # First position after final layer
y_pred = softmax(W_class · h_[CLS] + b)
```

**Multi-Head Attention**:

Instead of single attention, BERT uses `h` parallel heads:
```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · W^O

Where each head_i = Attention(Q·W^Q_i, K·W^K_i, V·W^V_i)
```

Each head has dimension `d_k = d_model / h` (e.g., 768 / 12 = 64).

### 3. Encoder-Decoder Transformers (T5 Family)

**Architecture**: Encoder stack + Decoder stack with cross-attention

**Key Characteristic**: Encoder processes input bidirectionally, decoder generates output autoregressively while attending to encoder outputs.

**Attention Flow**:
```
Encoder: Input → Bidirectional Self-Attention → Contextualized Representations
Decoder: <start> → Causal Self-Attention + Cross-Attention to Encoder → Output
```

**Training**: Denoising objectives (span corruption, prefix LM)

**Models**: T5, BART, mT5, PEGASUS

**Strengths**:
- Best for input→output transformations (translation, summarization)
- Encoder captures full context, decoder generates fluently
- Flexible: can handle variable-length inputs and outputs

**Weaknesses**:
- More parameters than decoder-only (2x the layers)
- Slower inference due to two-pass architecture

#### Mathematical Formulation

**Encoder Processing** (bidirectional):

For source sequence `x = [x_1, ..., x_S]`:
```
h_enc^(l) = TransformerBlock_enc(h_enc^(l-1))
Z = h_enc^(L)  # Final encoder output (contextualized representations)
```

**Decoder Processing** (causal + cross-attention):

For target sequence `y = [y_1, ..., y_T]`:

1. **Masked Self-Attention** (on target, causal):
   ```
   h_self = MultiHeadAttn_causal(h_dec, h_dec, h_dec)
   ```

2. **Cross-Attention** (to encoder outputs):
   ```
   h_cross = MultiHeadAttn(Q=h_dec, K=Z, V=Z)
   ```
   Query comes from decoder, Keys and Values come from encoder.

3. **Feed-Forward**:
   ```
   h_dec^(l) = FFN(h_cross)
   ```

**Training Objective** (Teacher Forcing):

During training, provide ground-truth previous tokens:
```
Loss = -sum(log P(y_t | y_{<t}, x))  for t=1 to T
```

At each position `t`, predict `y_t` given:
- All previous target tokens `y_{<t}` (via causal self-attention)
- All source tokens `x` (via cross-attention)

**Inference** (Autoregressive Generation):
```
# Start with <start> token
y_pred[1] = argmax P(y_1 | x)
y_pred[2] = argmax P(y_2 | y_pred[1], x)  
...
y_pred[t] = argmax P(y_t | y_pred[<t], x)
```

> **Architecture Visualization**
> See the diagram comparing all three variants side-by-side

## Code Examples: Implementing Each Type
<!-- /DEEP -->

### Decoder-Only (GPT-style)

```python
import numpy as np

class DecoderOnlyTransformer:
    def __init__(self, vocab_size, d_model, n_layers, n_heads):
        self.token_embed = np.random.randn(vocab_size, d_model)
        self.pos_embed = np.random.randn(2048, d_model)
        self.layers = [
            {"attn": np.random.randn(d_model, d_model), 
             "ffn": np.random.randn(d_model, d_model)}
            for _ in range(n_layers)
        ]
        self.output_head = np.random.randn(d_model, vocab_size)
    
    def forward(self, token_ids):
        # Embeddings
        x = self.token_embed[token_ids] + self.pos_embed[:len(token_ids)]
        
        # Apply causal attention mask
        for layer in self.layers:
            # Causal self-attention (can only see past)
            x = x + np.dot(x, layer["attn"])
            # Feed-forward
            x = x + np.dot(x, layer["ffn"])
        
        # Output logits for next token
        logits = np.dot(x, self.output_head)
        return logits

# Usage: Text Generation
model = DecoderOnlyTransformer(vocab_size=50000, d_model=768, n_layers=12, n_heads=12)
input_ids = [15, 42, 101]  # "The cat sat"
next_token_logits = model.forward(input_ids)
print("Logits shape:", next_token_logits.shape)  # (3, 50000) - predict next for each position
```

<!-- DEEP -->

**Key Implementation Detail**: In production, causal masking is applied by setting future positions to `-inf` before softmax:
```python
mask = np.triu(np.ones((seq_len, seq_len)) * -1e9, k=1)
attention_scores = attention_scores + mask
```
<!-- /DEEP -->

### Encoder-Only (BERT-style)

```python
class EncoderOnlyTransformer:
    def __init__(self, vocab_size, d_model, n_layers, n_heads):
        self.token_embed = np.random.randn(vocab_size, d_model)
        self.pos_embed = np.random.randn(512, d_model)
        self.layers = [
            {"attn": np.random.randn(d_model, d_model), 
             "ffn": np.random.randn(d_model, d_model)}
            for _ in range(n_layers)
        ]
        # Classification head (for tasks like sentiment analysis)
        self.classifier = np.random.randn(d_model, 2)  # Binary classification
    
    def forward(self, token_ids):
        # Embeddings
        x = self.token_embed[token_ids] + self.pos_embed[:len(token_ids)]
        
        # Bidirectional attention (no masking)
        for layer in self.layers:
            # Full self-attention (can see all tokens)
            x = x + np.dot(x, layer["attn"])
            x = x + np.dot(x, layer["ffn"])
        
        # Use [CLS] token (first position) for classification
        cls_embedding = x[0]
        logits = np.dot(cls_embedding, self.classifier)
        return logits

# Usage: Text Classification
model = EncoderOnlyTransformer(vocab_size=30000, d_model=768, n_layers=12, n_heads=12)
input_ids = [0, 15, 42, 101, 5]  # [CLS] The cat sat [SEP]
class_logits = model.forward(input_ids)
print("Class logits:", class_logits)  # (2,) - spam/not-spam probabilities
```

<!-- DEEP -->

**BERT Training**: During pretraining, 15% of tokens are masked. The model must predict the original token using bidirectional context:
```python
# Original: "The cat sat on the mat"
# Masked:   "The [MASK] sat on the mat"
# Model predicts: "cat"
```
<!-- /DEEP -->

### Encoder-Decoder (T5-style)

```python
class EncoderDecoderTransformer:
    def __init__(self, vocab_size, d_model, n_layers, n_heads):
        # Encoder components
        self.enc_token_embed = np.random.randn(vocab_size, d_model)
        self.enc_pos_embed = np.random.randn(512, d_model)
        self.encoder_layers = [
            {"self_attn": np.random.randn(d_model, d_model), 
             "ffn": np.random.randn(d_model, d_model)}
            for _ in range(n_layers)
        ]
        
        # Decoder components
        self.dec_token_embed = np.random.randn(vocab_size, d_model)
        self.dec_pos_embed = np.random.randn(512, d_model)
        self.decoder_layers = [
            {"self_attn": np.random.randn(d_model, d_model),
             "cross_attn": np.random.randn(d_model, d_model),  # Attends to encoder
             "ffn": np.random.randn(d_model, d_model)}
            for _ in range(n_layers)
        ]
        
        self.output_head = np.random.randn(d_model, vocab_size)
    
    def encode(self, input_ids):
        # Encoder: bidirectional attention
        x = self.enc_token_embed[input_ids] + self.enc_pos_embed[:len(input_ids)]
        for layer in self.encoder_layers:
            x = x + np.dot(x, layer["self_attn"])
            x = x + np.dot(x, layer["ffn"])
        return x  # Encoder hidden states
    
    def decode(self, target_ids, encoder_outputs):
        # Decoder: causal attention + cross-attention to encoder
        x = self.dec_token_embed[target_ids] + self.dec_pos_embed[:len(target_ids)]
        for layer in self.decoder_layers:
            # Self-attention (causal)
            x = x + np.dot(x, layer["self_attn"])
            # Cross-attention to encoder outputs
            x = x + np.dot(encoder_outputs, layer["cross_attn"])
            # Feed-forward
            x = x + np.dot(x, layer["ffn"])
        
        logits = np.dot(x, self.output_head)
        return logits

# Usage: Translation
model = EncoderDecoderTransformer(vocab_size=32000, d_model=512, n_layers=6, n_heads=8)
source_ids = [10, 20, 30]  # "Hello world"
target_ids = [40, 50]       # "Bonjour monde" (partial)

encoder_out = model.encode(source_ids)
translation_logits = model.decode(target_ids, encoder_out)
print("Translation logits shape:", translation_logits.shape)  # (2, 32000)
```

<!-- DEEP -->

## Choosing the Right Architecture

**Decision Framework**:

1. **Task Type**:
   - Generation tasks (chat, completion) → Decoder-Only
   - Understanding tasks (classification, NER) → Encoder-Only
   - Transformation tasks (translation, summarization) → Encoder-Decoder

2. **Context Requirements**:
   - Need future context for predictions → Encoder-Only
   - Sequential, left-to-right generation → Decoder-Only
   - Both encoding and generation → Encoder-Decoder

3. **Efficiency**:
   - Decoder-Only: Most parameter-efficient for multi-task (via prompting)
   - Encoder-Only: Fastest inference for classification
   - Encoder-Decoder: Highest quality for seq2seq, but 2x parameters

### Modern Trends (2024+)

**Decoder-Only Dominance**: The field has converged toward decoder-only models because:
- **Prompting**: Can solve ANY task via instructions (no need for task-specific architectures)
- **Scaling**: Easier to scale to 100B+ parameters
- **Flexibility**: One model for all use cases

**Result**: GPT-4, LLaMA, Mistral are all decoder-only, rendering encoder-only and encoder-decoder architectures less common for new research.

### Historical Context
- **2017**: Encoder-Decoder (original Transformer paper)
- **2018**: Encoder-Only (BERT) dominates NLP
- **2019-2020**: Encoder-Decoder (T5, BART) for seq2seq
- **2020-2024**: Decoder-Only (GPT-3, GPT-4) becomes universal architecture

**The Shift**: From task-specific architectures → One universal architecture with task-specific prompts

<!-- /DEEP -->

## Summary

<!-- SHALLOW -->
**Quick Recap**:
- **Decoder** (GPT): Generates text, one token at a time →
- **Encoder** (BERT): Understands text, sees whole context ⟷
- **Encoder-Decoder** (T5): Best of both, input→output 🔄

Pick the right tool for the job! 🛠️
<!-- /SHALLOW -->

<!-- DEEP -->
**Comprehensive Summary**:

Each transformer variant represents an architectural choice optimized for specific task families:

- **Decoder-Only**: Causal attention, autoregressive generation, universal via prompting
- **Encoder-Only**: Bidirectional attention, superior understanding, task-specific fine-tuning
- **Encoder-Decoder**: Hybrid architecture, optimal for structured transformations

The modern trend favors decoder-only due to prompting capabilities and scaling efficiency, but understanding all three provides crucial insight into the design space of neural architectures.

**Next Steps**: In your own projects, start with decoder-only (GPT-style) for maximum flexibility, and only consider alternatives if you have specific efficiency or quality requirements for understanding or seq2seq tasks.
<!-- /DEEP -->
