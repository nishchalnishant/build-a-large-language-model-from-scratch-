# Chapter 1: Understanding LLMs

## The Big Picture
Large Language Models (LLMs) like GPT-4 are probabilistic models that predict the next word in a sequence. They are built on the **Transformer** architecture, which allows them to process vast amounts of text data efficiently.

### How It Works
1. **Input**: Text is converted into numbers (tokens).
2. **Processing**: These numbers pass through multiple layers of "attention" and neural networks.
3. **Output**: The model assigns a probability score to every possible next word in its vocabulary.

## The Architecture
> **Look at the Visualization Panel (Bottom Right)**
> You can see a simplified diagram of the GPT architecture.
> - **Embeddings**: Convert words to vectors.
> - **Transformer Block**: The core processing unit.
> - **Output Head**: Converts vectors back to word probabilities.

### Key Components
*   **Embeddings**: A dense vector representation of text.
*   **Positional Encoding**: Tells the model the order of words.
*   **Multi-Head Attention**: Allows the model to focus on relevant parts of the input.
*   **Feed-Forward Network**: Processes the information extracted by attention.

## Code Example: A Simple Prediction
While modern LLMs are complex, the core idea is simple conditional probability:
$P(w_t | w_{t-1}, ..., w_1)$

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
