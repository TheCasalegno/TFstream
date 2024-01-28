const express = require("express");
const router = express.Router();
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const urldb = process.env.DB_STRING

const WebSocket = require("ws");
const client = new WebSocket("ws://localhost:8880");

router.post("/", (req, res) => {
  MongoClient.connect(urldb, function (err, db) {
    const dbID = db.db(process.env.DB_NAME);

    if (err) throw err;

    dbID
      .collection("alto")
      .find({ pettorale: parseInt(req.body.pettorale) })
      .toArray(function (err, result) {
        if (err) throw err;

        if (result == "") {
          console.log("Error: NO matching ATHLETE FOUND!");
          let pettorale = req.body.pettorale;
          let nome = "ERROR";
          let squadra = "ERROR";
          let misura = "ERROR";
          let errore = "matching";
          res.render("public/backend/sender/alto", {
            pettorale,
            nome,
            squadra,
            misura,
            errore,
          });
        } else {
          if (result[0].misura != parseInt(req.body.misura)) {
            var risultati = req.body.risultato;
            dbID
              .collection("alto")
              .updateOne(
                { pettorale: parseInt(req.body.pettorale) },
                {
                  $set: {
                    misura: parseInt(req.body.misura),
                    risultati: req.body.risultato,
                  },
                }
              );
          } else {
            var risultati = result[0].risultati + req.body.risultato;
            dbID
              .collection("alto")
              .updateOne(
                { pettorale: parseInt(req.body.pettorale) },
                {
                  $set: { risultati: result[0].risultati + req.body.risultato },
                }
              );
          }

          let pettorale = req.body.pettorale;
          let misura = req.body.misura;
          let nome = result[0].nome;
          let squadra = result[0].squadra;
          let accredito = result[0].accredito;
          let gara = "alto";
          let errore;

          let jsonData = {
            pettorale: pettorale,
            nome: nome,
            misura: misura,
            squadra: squadra,
            accredito: accredito,
            risultati: risultati,
            gara: gara,
          };

          let jsonString = JSON.stringify(jsonData);
          client.send(jsonString);
          res.render("public/backend/sender/alto", {
            pettorale,
            nome,
            misura,
            squadra,
            accredito,
            risultati,
            gara,
            errore,
          });
        }
      });
  });
});

router.get("/", (req, res) => {
  let pettorale;
  let nome;
  let squadra;
  let misura;
  let errore;

  res.render("public/backend/sender/alto", {
    pettorale,
    nome,
    squadra,
    misura,
    errore,
  });
});

module.exports = router;
