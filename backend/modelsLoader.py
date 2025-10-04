from flask import Flask, request, jsonify
import torch
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

app = Flask(__name__)

model = torch.jit.load("K2_best_residual_mlp_model.pth")
model.eval()

# Global preprocessing objects (initialized once)
scaler = None
label_encoders = {}
selected_features = None

def initialize_preprocessing():
    """Initialize preprocessing pipeline with the same steps as the notebook"""
    global scaler, label_encoders, selected_features
    
    # Load and preprocess data (same as notebook)
    try:
        df = pd.read_csv('Data/k2pandc final.csv')
    except FileNotFoundError:
        # If CSV file not found, use a minimal preprocessing setup
        # This allows the API to work even without the full dataset
        print("Warning: CSV file not found. Using minimal preprocessing setup.")
        return None, {}, ['pl_radeerr2', 'sy_vmag', 'sy_pnum', 'dec', 'soltype', 'sy_kmag', 'sy_disterr1', 'sy_disterr2', 'default_flag', 'disc_year', 'sy_gaiamag']
    
    # 1. Drop unnecessary columns (same as notebook)
    cols_to_drop = [
        'loc_rowid','pl_name','hostname','disp_refname','pl_refname','st_refname',
        'sy_refname','rowupdate','pl_pubdate','releasedate',
        'pl_orbsmax','pl_orbsmaxerr1','pl_orbsmaxerr2','pl_orbsmaxlim',
        'pl_bmasse','pl_bmasseerr1','pl_bmasseerr2','pl_bmasselim',
        'pl_bmassj','pl_bmassjerr1','pl_bmassjerr2','pl_bmassjlim','pl_bmassprov',
        'pl_orbeccen','pl_orbeccenerr1','pl_orbeccenerr2','pl_orbeccenlim',
        'pl_insol','pl_insolerr1','pl_insolerr2','pl_insollim',
        'pl_eqt','pl_eqterr1','pl_eqterr2','pl_eqtlim',
        'st_spectype','st_mass','st_masserr1','st_masserr2','st_masslim',
        'st_met','st_meterr1','st_meterr2','st_metlim','st_metratio',
        'pl_radj','pl_radjerr1','pl_radjerr2','pl_radjlim',
        'pl_orbpererr1','pl_orbpererr2','pl_orbperlim',
        'st_tefferr1','st_tefferr2','st_tefflim',
        'st_raderr1','st_raderr2','st_radlim',
        'sy_vmagerr1','sy_vmagerr2','sy_kmagerr1','sy_kmagerr2',
        'sy_gaiamagerr1','sy_gaiamagerr2'
    ]
    df = df.drop(columns=cols_to_drop)
    
    # 2. Handle missing values
    missing_pct = df.isnull().mean() * 100
    cols_to_drop_missing = missing_pct[missing_pct > 50].index
    df = df.drop(columns=cols_to_drop_missing)
    
    # Fill missing values
    num_cols = df.select_dtypes(include=['float64', 'int64']).columns
    cat_cols = df.select_dtypes(include=['object', 'category', 'bool']).columns
    df[num_cols] = df[num_cols].fillna(df[num_cols].median())
    
    for col in cat_cols:
        mode = df[col].mode()
        df[col] = df[col].fillna(mode[0] if not mode.empty else 'Unknown')
    
    # 3. Scale numerical features
    df_scaled = df.copy()
    num_cols = df_scaled.select_dtypes(include=['float64', 'int64']).columns
    scaler = StandardScaler()
    df_scaled[num_cols] = scaler.fit_transform(df_scaled[num_cols])
    
    # 4. Encode categorical features
    df_encoded = df_scaled.copy()
    cat_cols = df_encoded.select_dtypes(include=['object', 'category', 'bool']).columns
    
    for col in cat_cols:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col].fillna('NaN_Label'))
        label_encoders[col] = le
    
    # 5. Feature selection (same as notebook)
    X = df_encoded.drop(columns=['disposition'])
    y = df_encoded['disposition']
    
    # Remove class 3 (same as notebook)
    mask = y != 3
    X = X[mask]
    y = y[mask]
    
    # Feature selection using correlation and importance
    corr_with_target = df_encoded.corr(numeric_only=True)['disposition'].drop('disposition').abs()
    top_corr = corr_with_target.sort_values(ascending=False).head(7).index.tolist()
    
    # Random Forest importance
    X_train, _, y_train, _ = train_test_split(X, y, random_state=42)
    rf = RandomForestClassifier(random_state=42)
    rf.fit(X_train, y_train)
    importances = pd.Series(rf.feature_importances_, index=X.columns).sort_values(ascending=False)
    top_importance = importances.head(7).index.tolist()
    
    # Combine selected features
    selected_features = list(set(top_corr + top_importance))
    
    return scaler, label_encoders, selected_features

def preprocess_input(data):
    """Preprocess input data using the same pipeline as training"""
    global scaler, label_encoders, selected_features
    
    # Initialize preprocessing if not done yet
    if scaler is None:
        scaler, label_encoders, selected_features = initialize_preprocessing()
    
    # Convert input to DataFrame
    if isinstance(data, list):
        # Single sample
        df_input = pd.DataFrame([data], columns=selected_features)
    else:
        # Multiple samples
        df_input = pd.DataFrame(data)
    
    # Ensure we have the right columns
    if len(df_input.columns) != len(selected_features):
        # If input doesn't match expected features, create a DataFrame with the right structure
        df_input = pd.DataFrame([data], columns=selected_features)
    
    # Convert to tensor
    x = torch.tensor(df_input.values, dtype=torch.float32)
    
    return x.unsqueeze(0) if x.dim() == 1 else x

@app.route("/batch_predict", methods=["POST"])
def batch_predict():
    try:
        data = request.get_json()
        model_id = data.get("modelId")
        inputs = data.get("inputs", [])

        results = []
        for row in inputs:
            # Apply preprocessing to each input row
            x = preprocess_input(row)
            with torch.no_grad():
                output = model(x)
                pred = output.argmax(dim=1).item()
            results.append({"input": row, "prediction": pred})

        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/predict", methods=["POST"])
def predict():
    try:
        raw_data = request.json["data"]  # From UI
        x = preprocess_input(raw_data)

        with torch.no_grad():
            output = model(x).tolist()

        return jsonify({"prediction": output})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/models_fetching", methods=["GET"])
def get_models():
    # Example: return info about the loaded model(s)
    models_info = [
        {
            "id": "ResidualMLPmodel",
            "name": "Residual MLP Model",
            "desc": "A PyTorch residual MLP for exoplanet classification.",
            "tags": ["pytorch", "mlp", "exoplanet"]
        }
    ]
    return jsonify(models_info)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
