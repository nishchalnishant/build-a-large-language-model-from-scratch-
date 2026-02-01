# Chapter 6: Fine-tuning for Classification

## Adapting the Base Model
A pretrained model (from Chapter 5) is good at completing sentences, but maybe we want it to classify text (e.g., Detect Spam vs. Not Spam).

**Fine-tuning** allows us to take the general knowledge of the model and adapt it to a specific task.

### The Strategy
1.  **Load Pretrained Weights**: Start with a smart model, not a random one.
2.  **Replace the Head**: Swap the final "Vocabulary Prediction" layer with a simple "Class Prediction" layer (e.g., 2 outputs: Spam/Ham).
3.  **Train on Labeled Data**: Train on a dataset of emails labeled as spam or not.

> **Chat Interface (Simulated)**
> In the panel, you can see a simulated interaction. For this chapter, imagine the input is an email, and the output is a classification label.

## Code: Replacing the Output Head
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
