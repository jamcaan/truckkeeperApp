// const express = require("express");
// const jsonServer = require("json-server");

// const app = express();

// const PORT = process.env.PORT || 8000;

// app.use("/api", jsonServer.router("db.json"));
// app.use(express.static(__dirname + "/dist/truckkeeper-app"));

// app.get("/*", (req, res) => {
//   res.sendFile(__dirname + "/dist/truckkeeper-app/index.html");
// });

// app.listen(PORT, () => {
//   console.log("Server initial port: " + PORT);
// });

// server.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

