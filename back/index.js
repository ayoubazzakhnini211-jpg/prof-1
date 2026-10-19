require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
// trim() : une valeur collée dans Vercel peut finir par un retour à la ligne invisible.
const MONGODB_URL = (process.env.MONGODB_URL || "").trim();

// Dernière erreur de connexion, affichée par /health.
let dbError = null;

async function connectDB() {
  if (!MONGODB_URL) {
    dbError = "MONGODB_URL manquant";
    console.error("❌ MONGODB_URL manquant : ajoute-le dans back/.env (ou dans les variables d'environnement Vercel)");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL, { serverSelectionTimeoutMS: 10000 });
    dbError = null;

    console.log("✅ Connecté à MongoDB Atlas");
  } catch (error) {
    // Ne pas tuer le process : sur Vercel ça ferait planter la fonction entière.
    dbError = error.message;
    console.error("❌ Erreur de connexion MongoDB :", error.message);
  }
}

const dbReady = connectDB();

app.get("/health", async (req, res) => {
  // Sur Vercel la requête peut arriver avant la fin de la connexion : on l'attend.
  await dbReady;

  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    mongodb: connected ? "connecté" : "déconnecté",
    ...(connected ? {} : { erreur: dbError }),
  });
});

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Back</title>
  </head>
  <body style="margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif;">
    <h1>hello back</h1>
  </body>
</html>`);
});

// Start a server only when run locally (npm start); Vercel imports the exported app instead.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
