# Chapter 7: Fine-tuning to Follow Instructions

## From Completion to Assistant
A base GPT model is a "document completer". If you ask "What is the capital of France?", it might complete it with "and what is its population?" because that looks like a list of questions.

To turn it into an **Assistant** (like ChatGPT), we need **Instruction Tuning**.

### Instruction Datasets
We train the model on pairs of `(Instruction, Response)`.
*   Input: "Translate 'Hello' to Spanish."
*   Target: "Hola."

### Reinforcement Learning from Human Feedback (RLHF)
For advanced models, we go a step further:
1.  Model generates multiple responses.
2.  Humans rank them (Response A > Response B).
3.  We train a **Reward Model** to learn human preferences.
4.  We use PPO (Reinforcement Learning) to optimize the LLM to maximize this reward.

> **Interactive Chat**
> The panel below simulates an instruction-tuned model. Go ahead and type "Hello" or ask a simple question. The simulated response represents the model's ability to follow the conversational instruction.

## The Future
You have now walked through the entire pipeline:
1.  Data Prep & Tokenization
2.  Attention & Architecture Design
3.  Pretraining (Base Model)
4.  Fine-tuning (Assistant/Specialist)

**Congratulations! You have the foundational knowledge to build LLMs.**
