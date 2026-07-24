const express = require('express');
const app = express();
app.get('/', (req, res) => {
  try {
    res.set({
      'Content-Length': 1234
    });
    res.send("hello");
  } catch(e) {
    console.error("ERROR:", e.message);
    res.status(500).send(e.message);
  }
});
const server = app.listen(3005, () => {
  fetch('http://localhost:3005/')
    .then(r => r.text())
    .then(t => { console.log("Response:", t); server.close(); })
    .catch(console.error);
});
