# 🌌 ExoNet: AI-Powered Exoplanet Classification  

### 🚀 Challenge: *A World Away – Hunting for Exoplanets with AI*  
Developed for the **NASA Space Apps Challenge 2025**

---

## 🛰️ 1. High-Level Project Summary  

**ExoClass** is a deep learning–based pipeline designed to classify **exoplanet candidates** from **NASA’s K2 mission** data.  
At its core, the system employs a **Residual Multi-Layer Perceptron (ResidualMLP)** model that categorizes planetary candidates into three dispositions:  
- **Confirmed**  
- **Candidate**  
- **False Positive**  

This project tackles the challenge of efficiently processing and classifying **massive astronomical datasets**, which often suffer from noise, missing values, and class imbalances.  
By automating this process with high precision, **ExoClass** significantly reduces manual effort for astronomers and accelerates the **discovery of new exoplanets**.  

### 🌠 Why It Matters  
Exoplanet discovery enhances our understanding of **planetary formation**, **habitability**, and the **universe itself**.  
Accurate automated classification enables faster follow-up observations and contributes to NASA’s ongoing mission of exploring beyond our solar system.  

---

## 🔭 2. Project Details  

### 🔹 What It Does  
Processes raw **K2 mission data**, performs **data preprocessing and feature engineering**, trains a **deep learning classification model**, and evaluates its accuracy in identifying exoplanet candidates.  

### 🔹 How It Works  
1. **Data Loading:** Import and explore NASA K2 dataset.  
2. **Preprocessing:** Handle missing values, drop irrelevant columns, and scale features.  
3. **Feature Engineering:** Conduct correlation analysis and Random Forest–based feature selection.  
4. **Model Architecture:**  
   - ResidualMLP with skip connections  
   - Dropout and Batch Normalization for regularization  
5. **Training:**  
   - Optimizer: **AdamW**  
   - Loss: **Focal Loss** (for class imbalance)  
   - Learning Rate Scheduler + Early Stopping  
6. **Evaluation:**  
   - Metrics: Accuracy, Precision, Recall, F1-score  
   - Visualizations: Confusion Matrix, ROC, and PR Curves  

### 🔹 Key Benefits  
- **95.28% accuracy** on test data  
- Strong robustness to imbalanced classes  
- **Explainable AI (XAI)** through SHAP interpretability  
- Scalable for future missions (TESS, Kepler, etc.)  

### 🔹 Tools & Technologies  
| Category | Tools |
|-----------|--------|
| Programming | Python 3 |
| Deep Learning | PyTorch |
| Data Processing | Pandas, NumPy, scikit-learn |
| Visualization | Matplotlib, Seaborn |
| Explainability | SHAP |
| Environment | Jupyter Notebook |

---

## 📡 3. NASA Data  

This project utilizes the **K2 Planets and Candidates Dataset** from the **NASA Exoplanet Archive**.  
It contains **4004 entries** with **95 features**, including:  
- Orbital period (`pl_orbper`)  
- Planet radius (`pl_rade`)  
- Stellar temperature (`st_teff`)  
- Disposition label (Confirmed / Candidate / False Positive)  

The data was used for training and evaluating the ResidualMLP classifier.  
This dataset directly inspired the project, enabling AI-driven analysis of **real astronomical observations**.  

**Dataset Source:**  
🔗 [NASA Exoplanet Archive – K2 Planets and Candidates](https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+k2pandc&format=csv)

---

## 🪐 4. Space Agency Partner & Other Data  

- **NASA Data:**  
  - *K2 Planets and Candidates Table* from the NASA Exoplanet Archive (Primary Dataset)  
- **Other Space Agency Data:**  
  - None used  
- **Open-Source Resources:**  
  - Python libraries (PyTorch, scikit-learn, SHAP, etc.)

---

## 🤖 5. Use of Artificial Intelligence  

**ExoClass** integrates Artificial Intelligence as its **core classification mechanism** and as a **creative tool** for development and presentation.  

- **AI for Model Development:**  
  ResidualMLP model trained via supervised learning for exoplanet classification.  

- **AI for Data Optimization:**  
  Automated feature selection, handling imbalance, and scaling.  

- **Explainable AI:**  
  SHAP values visualize feature influence on predictions.  

- **AI-Generated Media:**  
  Visuals designed using AI tools like **Canva AI** and **Adobe Firefly**, marked with visible *“AI-generated”* labels.  

- **AI Assistance in Documentation:**  
  **OpenAI GPT-5** used for documentation structuring and grammar refinement — all content reviewed by team members.  

> ⚠️ No NASA logos, mission identifiers, or official branding were used or generated with AI tools.

---

## 🌍 6. Future Impact & Next Steps  

- Expand model training to **TESS and Kepler datasets**.  
- Deploy a **web-based platform** for researchers to upload new data and receive instant predictions.  
- Integrate **automated retraining** using new mission data.  
- Collaborate with educational and research institutions to enhance public access to exoplanetary AI tools.  

---


## 💻 Installation & Usage  

1. Clone the repository:  
   ```bash
   git clone https://github.com/YourUsername/ExoClass.git
   cd ExoClass
