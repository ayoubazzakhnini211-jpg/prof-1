const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

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
