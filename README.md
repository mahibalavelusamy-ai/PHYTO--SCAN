# PhytoScan — Plant Health Assistant

PhytoScan is an AI-assisted agricultural plant-health assessment platform built for the AGRIMIND initiative. It combines on-device neural network classification (MobileNetV2 via TensorFlow.js) with a plant pathology reference knowledge base and multimodal Gemini AI guidance.

---

## Architecture Overview

```text
Leaf Photograph
  │
  ▼
[1] Preprocessing (224×224 RGB, [-1, 1] Normalization)
  │
  ▼
[2] On-Device TensorFlow.js Inference (Custom PlantVillage 38-class MobileNetV2 or Backbone)
  │
  ▼
[3] Confidence Gate (Certainty Threshold Evaluation; < 50% => "Not sure")
  │
  ▼
[4] Agricultural Knowledge Base Lookup (Exact Crop & Disease Matching)
  │
  ▼
[5] Multimodal Gemini AI Guidance (Online) OR On-Device Fallback (Offline)
  │
  ▼
Comprehensive Diagnostic Report & Actionable Next Steps
```

---

## Training and plugging in the model

PhytoScan is architected to load a custom-trained MobileNetV2 model fine-tuned on the PlantVillage dataset (38 classes covering 14 crop species). The model runs directly in the client browser with TensorFlow.js and caches automatically in IndexedDB (`indexeddb://phytoscan-model`) for offline field use.

Follow these 5 steps to train, export, host, and plug in your custom model:

### Step 1: Train in Google Colab

1. Open a Google Colab notebook with GPU runtime enabled.
2. Load the PlantVillage dataset (54,306 images across 38 classes and 14 crops).
3. Instantiate `tf.keras.applications.MobileNetV2` with `weights='imagenet'` and `include_top=False`.
4. Add global average pooling, a dropout layer (0.2), and a dense softmax classification head with 38 outputs:
   ```python
   base_model = tf.keras.applications.MobileNetV2(
       input_shape=(224, 224, 3),
       include_top=False,
       weights='imagenet'
   )
   base_model.trainable = False  # Freeze backbone for initial epochs

   inputs = tf.keras.Input(shape=(224, 224, 3))
   # Preprocessing matching: (pixel / 127.5 - 1.0)
   x = tf.keras.applications.mobilenet_v2.preprocess_input(inputs)
   x = base_model(x, training=False)
   x = tf.keras.layers.GlobalAveragePooling2D()(x)
   x = tf.keras.layers.Dropout(0.2)(x)
   outputs = tf.keras.layers.Dense(38, activation='softmax')(x)
   model = tf.keras.Model(inputs, outputs)
   ```
5. Train the classification head (e.g. 10 epochs), then unfreeze the top layers of MobileNetV2 for fine-tuning with a lower learning rate (e.g. `1e-5`).

### Step 2: Export the Model

Save the trained Keras model in TensorFlow SavedModel format:

```python
model.save('plant_disease_mobilenetv2_saved_model')
```

Also export the class names in exact softmax output index order:

```python
import json

# class_names must match the generator or dataset class_indices order
class_names = list(train_generator.class_indices.keys())
# e.g., ["Apple___Apple_scab", "Apple___Black_rot", ..., "Tomato___healthy"]

with open('labels.json', 'w') as f:
    json.dump(class_names, f, indent=2)
```

### Step 3: Convert to TensorFlow.js

Install the TensorFlow.js converter in your Colab or terminal:

```bash
pip install tensorflowjs
```

Convert the SavedModel into browser-ready web format:

```bash
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_layers_model \
    plant_disease_mobilenetv2_saved_model \
    ./tfjs_plant_model
```

This creates:
- `model.json` (model topology and manifest)
- `group1-shard1ofX.bin` (binary weight chunks)

### Step 4: Host with CORS Enabled

Place `model.json`, all `.bin` weight shards, and `labels.json` inside a publicly accessible storage bucket or CDN (such as Google Cloud Storage, AWS S3, or Cloudflare R2).

Ensure CORS is enabled so the browser can fetch the model shards. For Google Cloud Storage, apply a `cors.json` policy:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

Run:
```bash
gcloud storage buckets update gs://your-plant-models --cors-file=cors.json
```

Folder contents should be:
```text
https://storage.googleapis.com/your-plant-models/mobilenetv2/
├── model.json
├── group1-shard1of1.bin
└── labels.json
```

### Step 5: Set `CUSTOM_MODEL_URL`

In your environment or `.env` file, point `CUSTOM_MODEL_URL` to the hosted folder URL:

```env
CUSTOM_MODEL_URL="https://storage.googleapis.com/your-plant-models/mobilenetv2"
```

When PhytoScan boots:
1. It automatically downloads `model.json` and `labels.json` with a live progress indicator.
2. It caches the model in browser storage (`indexeddb://phytoscan-model`).
3. When offline, it runs inference completely from IndexedDB without internet access.
4. If `CUSTOM_MODEL_URL` is omitted or unavailable, PhytoScan falls back to the standard feature backbone without interruption.
