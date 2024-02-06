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
app.get(apiUrl + "file/return", function (req, res) {
  let entiresFileLocation = `${__dirname}\\entries\\${req.query.filePath}\\${req.query.fileName}`

  if(!fs.existsSync(entiresFileLocation)) res.send({
    status: 404,
    statusText: `File ${entiresFileLocation} does not exist`
  })

  try{
    const data = fs.readFileSync(entiresFileLocation, 'utf8')
    res.send({
      status: 200,
      statusText: 'Retrieval successful',
      body: data
    })
  } catch(error) {
  
    res.send({
      status: 500,
      statusText: `Issue retrieving ${entiresFileLocation}`
    })
  }

});

app.post(apiUrl+"file/save", (req, res) => {
  let savingLocation = `${__dirname}\\${req.body.filePath}`

  if(!fs.existsSync(savingLocation)) res.send({
    status: 404,
    statusText: `Save location ${savingLocation} does not exist`
  })

  fs.writeFileSync(`${savingLocation}\\${req.body.fileName}`, req.body.content, err => {
    res.send({
      status: 500,
      statusText: `Error while saving: ${err}`
    })
  })

  res.send({
    status: 200,
    statusText: 'File save successfully'
  })
})

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
