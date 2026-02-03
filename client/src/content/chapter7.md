# Chapter 7: Fine-tuning to Follow Instructions

<!-- SHALLOW -->
## From Autocomplete → Assistant 🤖

A base model completes text. An instruction-tuned model follows commands!

### The Transformation
**Base model prompt**: "What is the capital of France?"  
**Base model output**: "and what is its population?"

**Instruction-tuned prompt**: "What is the capital of France?"  
**Instruction-tuned output**: "The capital of France is Paris."

### How It Works
Train on pairs like:
- **User**: "Translate 'hello' to Spanish"
- **Assistant**: "Hola"

After seeing thousands of examples, the model learns to follow ANY instruction!

> **Try the Chat →**
> The panel shows a simulated instruction-tuned model. Type a command and see it respond!

<!-- /SHALLOW -->

<!-- DEEP -->
## From Completion to Conversational Assistant

A base GPT model is fundamentally a "document completer." If you prompt it with "What is the capital of France?", it might complete it with "and what is its population?" because that resembles a list of sequential questions in its training data.

To transform it into an **Assistant** (like ChatGPT), we need **Instruction Tuning** - a specialized form of supervised fine-tuning.

### Instruction Datasets
We train the model on carefully curated pairs of `(Instruction, Desired Response)`:

**Examples**:
*   Input: "Translate 'Hello' to Spanish."  
    Target: "Hola."
*   Input: "Summarize this paragraph: [long text]"  
    Target: "[concise summary]"
*   Input: "What are the health benefits of exercise?"  
    Target: "Exercise improves cardiovascular health, boosts mood..."

### Data Collection Strategies
1. **Human-written**: Hire annotators to write instruction-response pairs
2. **Distillation**: Use GPT-4 to generate training data for smaller models
3. **User interactions**: Collect real conversations (with privacy safeguards)

Typical dataset sizes: 10K-100K instruction-response pairs

### Reinforcement Learning from Human Feedback (RLHF)
For advanced models like ChatGPT, we go beyond supervised fine-tuning:

**Phase 1 - Supervised Fine-Tuning (SFT)**:
Train on high-quality instruction-response pairs

**Phase 2 - Reward Modeling**:
1. Model generates multiple responses to the same prompt
2. Humans rank them (Response A > Response B > Response C)
3. Train a **Reward Model** to predict human preferences

**Phase 3 - Reinforcement Learning (PPO)**:
1. Use the reward model as the "judge"
2. Generate responses and get scores from reward model
3. Use PPO (Proximal Policy Optimization) to optimize the LLM to maximize reward
4. Balance with KL-divergence penalty to prevent drift from original model

### Why RLHF Matters
It aligns the model with human values:
- **Helpfulness**: Providing useful, accurate answers
- **Harmlessness**: Refusing dangerous requests
- **Honesty**: Admitting uncertainty instead of hallucinating

> **Interactive Chat Interface**
> The panel below simulates an instruction-tuned model. Go ahead and type "Hello" or ask a simple question. The simulated response represents the model's ability to follow conversational instructions rather than just complete text.

### The Alignment Tax
RLHF can reduce raw capability (e.g., creative writing) while improving safety and instruction-following. This trade-off is called the "alignment tax."

## The Future: Your LLM Journey Complete

You have now walked through the entire pipeline:
1.  **Data Prep & Tokenization** (Ch 2)
2.  **Attention & Architecture Design** (Ch 3-4)
3.  **Pretraining** (Ch 5): Building a base language model
4.  **Fine-tuning** (Ch 6-7): Adapting to specific tasks or conversational behavior

<!-- /DEEP -->

## Congratulations! 🎉

You now understand how modern LLMs are built from scratch. You've learned:
- Tokenization and embeddings
- Self-attention mechanisms
- Transformer architecture
- Pretraining objectives
- Fine-tuning strategies
- Instruction-tuning and RLHF

**You have the foundational knowledge to build, train, and deploy your own language models!**

<!-- DEEP -->

### What's Next?
- **Implement from scratch**: Build a GPT-2 sized model (117M params)
- **Experiment**: Try different architectures, loss functions, datasets
- **Read papers**: "Attention is All You Need", "Language Models are Few-Shot Learners"
- **Join the community**: Hugging Face, EleutherAI, research forums

**Key Resources**:
- Hugging Face Transformers library
- PyTorch/JAX for implementation
- The Pile dataset for pretraining
- Alpaca/Dolly datasets for instruction tuning

The field is evolving rapidly - stay curious and keep building! 🚀
<!-- /DEEP -->
