# Chapter 5: Pretraining on Unlabeled Data

<!-- SHALLOW -->
## Training the Model 🎯

How do we train this massive neural network? Simple: **predict the next word**.

### The Learning Process
Given "The cat sat on", the model tries to predict "the". If it gets it wrong, we adjust the weights. Repeat billions of times!

> **Watch the Loss Curve →**
> Training loss goes down = model getting smarter!

## Training Simulation
<!-- /SHALLOW -->

<!-- DEEP -->
## The Learning Objective: Next-Token Prediction

How do we train this massive neural network without labeled data? We use **self-supervised learning** - the data itself provides the labels.

**Objective**: Predict the next token given all previous tokens.
- Input: "The cat sat on"
- Target: "the"

This simple objective forces the model to learn:
- Grammar and syntax
- World knowledge
- Reasoning patterns
- Common sense

### Why This Works
By predicting the next word, the model must internalize:
- **Short-range dependencies**: "The cat" → needs singular verb
- **Long-range dependencies**: "The author who wrote..." (subject-verb agreement 10+ words apart)
- **Semantic coherence**: Must understand context to predict likely continuations

> **Visualization: Training Loss**
> The graph in the panel shows a typical loss curve.
> *   **Blue Line (Train)**: The model's error on data it has seen during training. Should decrease steadily.
> *   **Purple Line (Validation)**: The model's error on *held-out* data. If this diverges upward while training loss decreases, we're **overfitting**.

### Monitoring Training Health
- **Loss decreasing**: ✅ Learning is happening
- **Train/val gap widening**: ⚠️ Overfitting - reduce model size or add regularization
- **Both losses flat**: ⚠️ Learning rate too low or data exhausted
- **Loss exploding**: 🔴 Learning rate too high or gradient instability

## Calculating Loss: Cross-Entropy
We use **Cross-Entropy Loss** - it measures how different the model's predicted probability distribution is from the actual next token (which has probability 1.0 for the correct token, 0 for all others).

Formula:
$$\mathcal{L} = -\sum_{i} y_i \log(\hat{y}_i)$$

Where $y_i$ is the true distribution (one-hot) and $\hat{y}_i$ is the model's predicted probabilities.

## Training Loop Implementation
<!-- /DEEP -->

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

<!-- DEEP -->

### Real Training at Scale
Production LLMs are trained with:
- **Data**: 300B+ tokens (entire internet!)
- **Compute**: Thousands of GPUs for weeks
- **Optimization**: AdamW optimizer with cosine learning rate schedule
- **Cost**: $5-10M for GPT-3 scale models

### Data Preprocessing
Before training:
1. **Deduplication**: Remove repeated documents (improves sample diversity)
2. **Filtering**: Remove low-quality content (classifier-based)
3. **Balancing**: Upsample high-quality sources (Wikipedia, books)
4. **Shuffling**: Randomize order to prevent overfitting to document structure

### Learning Rate Scheduling
Typical schedule:
1. **Warmup**: Gradually increase LR from 0 → max over first 1-2% of training
2. **Cosine Decay**: Smoothly decrease to ~10% of max
3. **Final Cooldown**: Drop to very low LR for final convergence

**Critical Insight**: Pretraining is expensive, but the resulting model is a "foundation" that can be fine-tuned for countless downstream tasks!

**Next**: In Chapter 6, we'll learn how to adapt this pretrained model for specific tasks like classification.
<!-- /DEEP -->
