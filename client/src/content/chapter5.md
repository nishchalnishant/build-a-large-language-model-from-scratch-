# Chapter 5: Pretraining on Unlabeled Data

## The Learning Objective
How do we train this massive neural network? We don't need labeled data like "Sentiment: Positive". We just need raw text.

**Objective**: Predict the next token.
Given "The cat", predict "sat".
Given "The cat sat", predict "on".

This is called **Self-Supervised Learning**.

> **Visualization: Training Loss**
> The graph in the panel shows a typical loss curve.
> *   **Blue Line (Train)**: The model's error on data it has seen. It should go down steadily.
> *   **Purple Line (Validation)**: The model's error on *new* data. If this starts going up while training loss goes down, we are **overfitting**.

## Calculating Loss
We use **Cross Entropy Loss**. It measures the difference between the probability distribution the model predicted and the actual next word (which has a probability of 1.0).

```python
# Pseudo-code for a training loop
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)

for step, batch in enumerate(dataloader):
    inputs, targets = batch # inputs: "The cat", targets: "cat sat"
    
    logits = model(inputs)
    
    # Calculate Loss
    loss = F.cross_entropy(logits.view(-1, vocab_size), targets.view(-1))
    
    # Backprop
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    
    if step % 100 == 0:
        print(f"Step {step}: Loss {loss.item():.4f}")
```
