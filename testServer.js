var express = require("express");
var app = express();
var fs = require("fs");
var cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();

const apiUrl = "/api/";

var corsOptions = {
  origin: ["http://localhost:4200", "https://4gsgpp-4200.csb.app"],
  optionsSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors(corsOptions));

//getting all entries
app.get(apiUrl + "entries", function (req, res) {
  res.send(JSON.parse(entires));
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});

var entires = `[
        {
            "title": "title1",
            "type": "bluray",
            "certificate": "18"
        },
        {
            "title": "title2",
            "type": "bluray",
            "certificate": "15"
        },
        {
            "title": "title3",
            "type": "4k",
            "certificate": "pg"
        }
    ]`;
