//require modules
const express = require("express");
const app = express();
const path = require("path");

const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8880 });


//express static files settings
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets")));

app.set("view engine", "ejs");


//WebSocket server forward messages to all clients
server.on("connection", (ws) => {
  console.log("Client SENDER connesso a server INDEX");

  ws.on("message", (message) => {

    server.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`${message}`);
        }
    });
  });
});


//main page with useful links
app.get("/", (req, res) => {
  res.render("index");
});


//sender
const senderAlto = require("./routes/backend/sender/alto");
const senderCorse = require("./routes/backend/sender/corse");
const senderLungo = require("./routes/backend/sender/lungo");
const senderPeso = require("./routes/backend/sender/peso");

//backend
const setup = require("./routes/backend/setup");
const commento = require("./routes/backend/commento");

//frontend
const frontAlto = require("./routes/frontend/alto");
const frontPeso = require("./routes/frontend/peso");
const frontCorse = require("./routes/frontend/corse");
const frontLungo = require("./routes/frontend/lungo");

//sender
app.use("/sender/alto", senderAlto);
app.use("/sender/corse", senderCorse);
app.use("/sender/lungo", senderLungo);
app.use("/sender/peso", senderPeso);

//backend
app.use("/setup", setup);
app.use("/commento", commento);

//frontend
app.use("/alto", frontAlto);
app.use("/corse", frontCorse);
app.use("/lungo", frontLungo);
app.use("/peso", frontPeso);


//listen on port 2087
app.listen(2087);
