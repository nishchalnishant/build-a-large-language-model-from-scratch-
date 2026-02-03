# Chapter 2: Working with Text Data

<!-- SHALLOW -->
## Tokenization: Words → Numbers

Before an LLM can process text, we need to convert it into numbers. This process is called **tokenization**.

### The Process (Quick Version)
1. **Break text into chunks** (words, subwords, or characters)
2. **Assign each chunk a unique ID** from a vocabulary
3. **Feed the IDs** to the model

> **Try the Tokenizer →**
> Type some text in the interactive panel to see it split into tokens!

## Example: Simple Tokenization
<!-- /SHALLOW -->

<!-- DEEP -->
## Tokenization: The Foundation of Text Processing

Before an LLM can process text, we need to convert it into numbers. This process is called **tokenization** - the method of breaking text into discrete units (tokens) and mapping them to integer IDs.

### Why Tokenization Matters
- **Compression**: Subword tokenization balances vocabulary size with text coverage
- **Out-of-Vocabulary Handling**: Byte-Pair Encoding (BPE) can represent any word through subword units
- **Multilinguality**: Modern tokenizers handle 100+ languages efficiently

### Tokenization Strategies
1. **Word-Level**: Split on whitespace/punctuation (simple but huge vocabulary)
2. **Character-Level**: Each character is a token (small vocab but long sequences)
3. **Subword-Level (BPE)**: Best of both worlds - commonly used by GPT models

### The Process (Detailed)
1. **Text Preprocessing**: Normalize unicode, handle special characters
2. **Splitting**: Apply tokenization algorithm (BPE, WordPiece, etc.)
3. **ID Mapping**: Convert each token to its vocabulary index
4. **Special Tokens**: Add `<start>`, `<end>`, `<padding>` markers as needed

> **Try the Tokenizer (Interactive) →**
> Type some text in the interactive panel. Notice how:
> - Common words like "the" get single tokens
> - Rare words split into subword units
> - Numbers and punctuation have special handling

## Example: Manual Tokenization
<!-- /DEEP -->

```python
# Simple word-based tokenization (for demonstration)
text = "The quick brown fox jumps"
tokens = text.lower().split()  # Split on whitespace

# Create a vocabulary
vocab = {word: idx for idx, word in enumerate(set(tokens))}

# Convert to IDs
token_ids = [vocab[token] for token in tokens]

print("Tokens:", tokens)
print("Vocabulary:", vocab)
print("Token IDs:", token_ids)
```

<!-- DEEP -->

### Real-World Tokenizers
Production LLMs use sophisticated algorithms:
- **GPT-2/GPT-3**: Byte-Pair Encoding (BPE) with 50k vocab
- **BERT**: WordPiece tokenization
- **LLaMA**: Sentence Piece with 32k tokens

### Context Windows and Sequence Length
Transformers have a maximum sequence length (e.g., 2048 tokens for GPT-2). Longer texts must be:
- **Truncated**: Cut off after max length
- **Chunked**: Split into overlapping segments
- **Summarized**: Compressed before processing

**Practical Tip**: Always check your tokenizer's vocabulary size and special token handling before training!
<!-- /DEEP -->
