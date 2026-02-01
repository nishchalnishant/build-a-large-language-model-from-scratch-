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
import numpy as np
import time

# Simulation of a training loop
# In a real scenario, we would use Automatic Differentiation (AutoGrad)

# Mock model loss starting high and decreasing
loss = 5.0
learning_rate = 0.1

print("Starting training...")
for step in range(501):
    # Simulate loss going down
    loss = loss * 0.99
    
    # Add some random noise to make it look realistic
    current_loss = loss + (np.random.rand() * 0.1)
    
    if step % 100 == 0:
        print(f"Step {step}: Loss {current_loss:.4f}")
        
print("Training complete! Loss converged.")
```
