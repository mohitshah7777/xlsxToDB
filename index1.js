const express = require('express');
const cors = require('cors');
const multer = require('multer');
const exceltojson = require('convert-excel-to-json')
require('./config');
require('dotenv').config();

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

const app = express();
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({storage:storage});

app.post('/upload', upload.single('xlsx-file'), (req,res) => {
    console.log(req.file);
    res.send("single file upload success")
})


function importExcelData2MongoDB(filePath){
    // -> Read Excel File to Json Data
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets:[{
            // Excel Sheet Name
            name: 'Customers',
 
            // Header Row -> be skipped and will not be present at our result object.
            header:{
               rows: 1
            },
			
            // Mapping columns to keys
            columnToKey: {
                A: '_id',
                B: 'name',
                C: 'title',
                D: 'blog'
            }
        }]
    });
 
    // -> Log Excel Data to Console
    console.log(excelData);
 
    // Insert Json-Object to MongoDB
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        let dbo = db.db("gkzdb");
        dbo.collection("customers").insertMany(excelData.Customers, (err, res) => {
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



app.get('/', (req,res) => {
    res.send('Hello from browser');
})

app.listen(process.env.PORT, () => {
    console.log(`server is running on port 3000`);
})
