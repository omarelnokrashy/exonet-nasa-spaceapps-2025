const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());
app.use(express.json());


app.post("/predict", async (req, res) => {
  console.log("➡️ /predict called with body:", req.body);
  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    console.log("✅ Flask /predict status:", response.status);
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("❌ Error calling Flask /predict:", error);
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.get("/models", async (req, res) => {
  console.log("➡️ /models called in Node backend");
  try {
    const response = await fetch("http://127.0.0.1:5000/models_fetching");
    console.log("✅ Flask /models_fetching status:", response.status);

    const models = await response.json();
    console.log("✅ Received models from Flask:", models);
    res.json(models);
  } catch (error) {
    console.error("❌ Error fetching from Flask:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

app.listen(3001, () => console.log("✅ Node backend running on port 3001"));
