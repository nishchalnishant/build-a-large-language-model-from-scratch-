# Glossary of Terms

This section provides definitions for key concepts used throughout this course, focusing on Large Language Models (LLMs) and AI Agents.

## LLM Foundations

**Transformer**
A deep learning architecture based on the self-attention mechanism, introduced in the paper "Attention Is All You Need" (2017). It is the foundation of modern LLMs like GPT, BERT, and Claude.

**Self-Attention**
The mechanism that allows a model to weigh the importance of different words in a sentence relative to a specific word. It enables the model to understand context and relationships between distant words.

**Embedding**
A dense vector representation of a token (word or character) in a high-dimensional space. Embeddings capture semantic meaning, so that words with similar meanings have similar vector representations.

**Token**
The basic unit of text processed by an LLM. It can be a word, part of a word, or a character. For example, "tokenization" might be split into tokens like "token", "iz", "ation".

**Temperature**
A parameter that controls the randomness of the model's output. Low temperature (e.g., 0.2) results in more deterministic and focused responses, while high temperature (e.g., 0.8) leads to more creative and varied outputs.

## Agentic AI Concepts

**Agent**
An AI system capable of autonomous action to achieve a goal. Unlike a passive model that just answers questions, an agent can perceive its environment, reason about how to solve a problem, and take actions (like using tools) to execute its plan.

**Chain of Thought (CoT)**
A prompting technique where the model is encouraged to "think out loud" or break down a complex problem into intermediate reasoning steps before providing the final answer. This significantly improves performance on reasoning tasks.

**ReAct (Reason + Act)**
A paradigm for building agents where the model interleaves "Reasoning" (thinking about what to do next) and "Acting" (executing a tool call). This loop allows the model to dynamically adjust its plan based on new information.

**Tool Use**
The ability of an LLM to invoke external functions or APIs (like a calculator, web search, or file system) to perform tasks it cannot do alone (e.g., precise math or getting current weather).

**Hallucination**
A phenomenon where an LLM generates text that performs confidently but is factually incorrect or nonsensical. It occurs because the model predicts the next likely token based on patterns, not factual lookups.
