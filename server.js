const express = require("express");
const jsonServer = require("json-server");

const app = express();

const PORT = process.env.PORT || 8000;

app.use("/api", jsonServer.router("db.json"));
app.use(express.static(__dirname + "/dist/truckkeeper-app"));

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/truckkeeper-app/index.html");
});

app.listen(PORT, () => {
  console.log("Server initial port: " + PORT);
});
