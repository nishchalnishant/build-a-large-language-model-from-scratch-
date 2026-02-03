# Chapter 1: Understanding LLMs

<!-- SHALLOW -->
## The Big Picture
Large Language Models (LLMs) like GPT-4 predict the next word in a sequence. Think of it like autocomplete on steroids - the model learns patterns from millions of text examples and uses them to continue your sentences intelligently.

### How It Works (Simple Version)
1. **Input**: Text → Numbers (tokens)
2. **Processing**: Neural network magic ✨  
3. **Output**: Probability scores for next words

> **Look at the Visualization Panel →**
> See a simplified diagram of how data flows through a GPT model.

## Try It: Simple Word Embeddings
Run the code to see how words become numbers:
<!-- /SHALLOW -->

<!-- DEEP -->
## The Big Picture
Large Language Models (LLMs) like GPT-4 are probabilistic models that predict the next word in a sequence. They are built on the **Transformer** architecture, which allows them to process vast amounts of text data efficiently through parallel computation and self-attention mechanisms.

### How It Works (Detailed)
1. **Input**: Text is converted into numbers (tokens) via a vocabulary mapping
2. **Processing**: These numbers pass through multiple layers of "attention" and feed-forward neural networks
3. **Output**: The model assigns a probability distribution over its entire vocabulary for the next token

### Mathematical Foundation
The core prediction task can be formalized as:
$$P(w_t | w_{t-1}, ..., w_1)$$

This conditional probability represents: "What's the likelihood of word $w_t$ appearing, given all previous words?"

## The Architecture
> **Look at the Visualization Panel (Bottom Right)**
> You can see a simplified diagram of the GPT architecture.
> - **Embeddings**: Convert words to dense vectors in continuous space
> - **Transformer Block**: The core processing unit with self-attention and feed-forward layers
> - **Output Head**: Projects vectors back to vocabulary-sized logits for next-word prediction

### Key Components (Deep Dive)
*   **Embeddings**: A dense vector representation of text where semantically similar words have similar vectors
*   **Positional Encoding**: Injects sequence order information since transformers have no inherent notion of position
*   **Multi-Head Attention**: Allows the model to simultaneously attend to information from different representation subspaces
*   **Feed-Forward Network**: Processes the aggregated contextual information for each position independently

## Code Example: Word Embeddings
Modern LLMs start by converting discrete tokens into continuous vector representations. This simple code demonstrates embedding lookup:
<!-- /DEEP -->

```python
import numpy as np

# A tiny example of an embedding layer
vocab_size = 1000
embedding_dim = 16

# Random embedding matrix (vocab_size x embedding_dim)
# In a real model, these numbers are learned during training
embedding_matrix = np.random.rand(vocab_size, embedding_dim)

input_id = 42 # Representative of a word
vector = embedding_matrix[input_id] # Look up the vector

print(f"Input ID: {input_id}")
print(f"Vector shape: {vector.shape}")
print(f"First 5 values: {vector[:5]}")
```

<!-- DEEP -->

### Why Embeddings Matter
In traditional NLP, words were represented as one-hot vectors (all zeros except one position). This treats "king" and "kingdom" as completely unrelated. Embeddings learn to place related words closer together in vector space, enabling the model to generalize patterns across similar words.

**Next Steps**: In Chapter 2, we'll explore how text is tokenized before being embedded.
<!-- /DEEP -->
