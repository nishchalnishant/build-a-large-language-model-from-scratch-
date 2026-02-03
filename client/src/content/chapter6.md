# Chapter 6: Fine-tuning for Classification

<!-- SHALLOW -->
## Adapting the Model 🎨

Our pretrained model is good at completing sentences. But what if we want it to classify emails as spam/not spam?

### The Fix: Fine-Tuning
1. Take the smart pretrained model
2. Replace the final layer
3. Train on labeled examples (spam/not spam)

Done! The model keeps its language knowledge but learns the new task.

## Try It
<!-- /SHALLOW -->

<!-- DEEP -->
## Adapting the Base Model for Downstream Tasks

A pretrained model (from Chapter 5) is excellent at language modeling - predicting what comes next. But for real-world applications, we often need **classification** (sentiment, spam detection, topic categorization).

**Fine-tuning** allows us to take the general knowledge of the pretrained model and adapt it to a specific task with relatively little labeled data.

### Why Fine-Tuning Works
The pretrained model has learned:
- **Syntax**: Grammatical structures
- **Semantics**: Word meanings and relationships
- **Reasoning**: Basic inference patterns

We just need to teach it: "Given this email, output spam=1 or not-spam=0"

### The Strategy
1.  **Load Pretrained Weights**: Start with a model that already understands language (not random initialization)
2.  **Replace the Head**: Swap the final "Vocabulary Prediction" layer (50k outputs) with a "Class Prediction" layer (e.g., 2 outputs: Spam/Ham)
3.  **Train on Labeled Data**: Fine-tune on a dataset of emails labeled as spam or legitimate

> **Chat Interface (Simulated)**
> In the panel, you can see a simulated interaction. For this chapter, imagine the input is an email text, and the output is a classification label (Spam/Not Spam).

### Transfer Learning Benefits
- **Data Efficiency**: Need only 1k-10k labeled examples instead of millions
- **Better Generalization**: Leverages patterns learned from massive pretraining data
- **Faster**: Converges in minutes/hours instead of days

## Code: Replacing the Output Head
<!-- /DEEP -->

```python
import numpy as np

# Assume 'model' is our GPTModel from Chapter 4
# And it has pre-trained weights loaded

# 1. Inspect the existing head
print(f"Original Head Shape: {model.head_w.shape}")
# Example: (16, 1000) -> predicting 1000 vocab words

# 2. Replace the Head for Classification
# We want to predict just 2 classes: Spam (1) or Not Spam (0)
num_classes = 2
d_model = 16

# Re-initialize the final layer weights
# In a real framework, this resets the weights to random
model.head_w = np.random.randn(d_model, num_classes)

print(f"New Head Shape: {model.head_w.shape}")
# Now if we run forward(), output will be (Batch, 2) instead of (Batch, 1000)

# 3. Freeze Body (Conceptual)
# In our manual training loop, we would simply ONLY update 'model.head_w'
# and NOT update 'model.blocks' or embeddings.
print("Body frozen. Only training the new head...")
```

<!-- DEEP -->

### Freezing Strategies
| Strategy | What's Updated | Data Needed | Quality |
|----------|----------------|-------------|---------|
| **Head-only** | Just final layer | 100-1K examples | Good for small datasets |
| **Last N layers** | Top layers + head | 1K-10K examples | Balanced approach |
| **Full fine-tuning** | All parameters | 10K+ examples | Best quality |

### Training Details
Typical hyperparameters for classification fine-tuning:
- **Learning Rate**: 1e-5 to 5e-5 (much lower than pretraining!)
- **Epochs**: 2-4 (prevents catastrophic forgetting)
- **Batch Size**: 8-32
- **Dropout**: 0.1 for regularization

### Common Pitfalls
⚠️ **Catastrophic Forgetting**: If you train too long or with high LR, the model forgets its pretrained knowledge
⚠️ **Overfitting**: Small datasets require careful regularization

**Best Practice**: Always validate on a held-out test set to monitor for overfitting!

**Next**: In Chapter 7, we'll see how to fine-tune for instruction-following (like ChatGPT).
<!-- /DEEP -->
