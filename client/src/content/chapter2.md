# Chapter 2: Working with Text Data

## Tokenization
Computers cannot understand raw text. We must convert text into numbers. This process is called **tokenization**.

### Types of Tokenization
1.  **Character-level**: Splits text into individual characters. Simple, but results in long sequences.
2.  **Word-level**: Splits text into words. Huge vocabulary size.
3.  **Subword-level (BPE/Byte-Pair Encoding)**: The gold standard. Splits common words into whole tokens and rare words into sub-parts.

> **Try the Visualization!**
> In the bottom-right panel, type any sentence into the **tokenization explorer**.
> Observe how words are split. Common words like "the" are single tokens. Complex or rare words might be split into multiple chunks.

## Vocabulary Building
We build a vocabulary by scanning a large corpus of text and finding the most frequent patterns. In GPT-2/3, the vocabulary size is typically around 50,257 tokens.

## Python Implementation
Here is how a simple tokenizer works in code:

```python
# A simple dictionary-based tokenizer
text = "The cat sat on the mat."
vocab = {
    "The": 1, "cat": 2, "sat": 3, "on": 4, "mat": 5, ".": 6
}

tokens = [vocab.get(word, 0) for word in text.split()]
print(f"Text: {text}")
print(f"Tokens: {tokens}")
```

In this chapter, we will implement a robust BPE tokenizer capable of handling any text input.
