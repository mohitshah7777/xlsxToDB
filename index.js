const fs = require('fs');
const multer = require('multer');
const express = require('express');
var bodyParser = require('body-parser');

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

const excelToJson = require('convert-excel-to-json');

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
global.__basedir = __dirname;

// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

// const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// -> Express Upload RestAPIs
app.post('/upload', upload.single("xlsx-file"), (req, res) => {

    // const bufferFile = req.file["buffer"].toString();
    // const orderArr = 

    importExcelData2MongoDB(__basedir + '/uploads/' + req.file.filename);
    res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
    });
});

// -> Import Excel File to MongoDB database
function importExcelData2MongoDB(filePath) {
    // -> Read Excel File to Json Data
    const excelData = excelToJson({
        source: fs.readFileSync(filePath),
        header: {
            rows: 1
        },
        columnToKey: {
            A: '_id',
            B: 'name',
            C: 'title',
            D: 'blog',
        }// fs.readFileSync return a Buffer
    });

    // -> Log Excel Data to Console
    console.log("hello => ", excelData);

    // Insert Json-Object to MongoDB
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        let dbo = db.db("gkzdb");
        dbo.collection("customers").insertMany([excelData], (err, res) => {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            /**
                Number of documents inserted: 5
            */
            db.close();
        });
    });

    fs.unlinkSync(filePath);
}

// Create a Server
let server = app.listen(3000, function () {

    let host = server.address().address;
    let port = server.address().port;

    console.log("App listening at http://%s:%s", host, port);
})