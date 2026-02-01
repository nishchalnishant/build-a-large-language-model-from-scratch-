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
model = GPTModel(...)
model.load_state_dict(pretrained_weights)

# Freeze the body (optional, for efficiency)
for param in model.parameters():
    param.requires_grad = False

# Replace the head
num_classes = 2 # Spam vs Ham
model.head = nn.Linear(d_model, num_classes)

# Now train as usual, but with classification labels!
```
