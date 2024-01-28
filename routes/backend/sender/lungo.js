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
      .collection("lungo")
      .find({ pettorale: parseInt(req.body.pettorale) })
      .toArray(function (err, result) {
        if (err) throw err;

        if (result == "") {
          console.log("Error: NO matching ATHLETE FOUND!");
          let pettorale = req.body.pettorale;
          let nome = "ERROR";
          let squadra = "ERROR";
          let risultato = "ERROR";
          let errore = "matching";
          res.render("public/backend/sender/lungo", {
            pettorale,
            nome,
            squadra,
            risultato,
            errore,
          });
        } else {

            if(req.body.risultato == "0") {
                var risultato = "X";
            } else {
                var risultato = req.body.misura;
            }

          if (result[0].misura1 == "") {
            var ris1 = risultato
            var ris2 = "-"
            var ris3 = "-"
            dbID
              .collection("lungo")
              .updateOne(
                { pettorale: parseInt(req.body.pettorale) },
                {
                  $set: {
                    misura1: parseInt(risultato),
                  },
                }
              );
          } else if (result[0].misura2 == "") {
            var ris1 = result[0].misura1
            var ris2 = risultato
            var ris3 = "-"
            dbID
              .collection("lungo")
              .updateOne(
                { pettorale: parseInt(req.body.pettorale) },
                {
                  $set: {
                    misura2: parseInt(risultato),
                  },
                }
              );
          } else if (result[0].misura3 == "") {
            var ris1 = result[0].misura1
            var ris2 = result[0].misura2
            var ris3 = risultato
            dbID
            .collection("lungo")
            .updateOne(
              { pettorale: parseInt(req.body.pettorale) },
              {
                $set: {
                  misura3: parseInt(risultato),
                },
              }
            );
          } else {
            var ris1 = risultato
            var ris2 = "-"
            var ris3 = "-"
            dbID
            .collection("lungo")
            .updateOne(
              { pettorale: parseInt(req.body.pettorale) },
              {
                $set: {
                  misura1: parseInt(risultato),
                  misura2: "",
                  misura3: "",
                },
              }
            );
          }

          let pettorale = req.body.pettorale;
          let nome = result[0].nome;
          let squadra = result[0].squadra;
          let accredito = result[0].accredito;
          let gara = "lungo";
          let errore;

          let jsonData = {
            pettorale: pettorale,
            nome: nome,
            ris1: ris1,
            ris2: ris2,
            ris3: ris3,
            squadra: squadra,
            accredito: accredito,
            gara: gara,
          };

          let jsonString = JSON.stringify(jsonData);
          client.send(jsonString);
          res.render("public/backend/sender/lungo", {
            pettorale,
            nome,
            risultato,
            squadra,
            accredito,
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
  let risultato;
  let errore;

  res.render("public/backend/sender/lungo", {
    pettorale,
    nome,
    squadra,
    risultato,
    errore,
  });
});

module.exports = router;
