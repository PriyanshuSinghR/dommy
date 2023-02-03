var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');
var csv = require('csvtojson');
var userSchema = require('./model');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    userSchema.find({}, (err, items) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json({ items: items });
        }
    });
});


const storage = multer.memoryStorage()

const upload = multer({ storage: storage });

function csvArrayToJSON(csvArray) {
    const headers = csvArray[0];
  
    const jsonArray = [];
  
    for (let i = 1; i < csvArray.length; i++) {
      const values = csvArray[i];
      const obj = {};
  
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j];
      }
  
      jsonArray.push(obj);
    }
  
    return jsonArray;
  }

app.post('/', upload.single('file'), (req, res, next) => {
    csv({
        noheader:true,
        output: "csv"
    })
    .fromString(req.file.buffer.toString())
    .then((csvRow)=>{ 
        // console.log(csvRow);
        const csvJson = csvArrayToJSON(csvRow);
        // console.log(csvJson);
        var user = [];
        for(var i = 0;i<csvJson.length;i++){
            var obj={};
            obj.name=csvJson[i]['Name'];
            obj.phone=csvJson[i]['PhoneNo'];
            obj.rollNo=csvJson[i]['RollNo'];
            user.push(obj);
        }
        console.log(user);
        userSchema.insertMany(user).then(function(){
            res.status(200).send({
                message: "Successfully Uploaded!"
            });
    }).catch(function(error){
            res.status(500).send({
                message: "failure",
                error
            });
        });
    }).catch((error) => {
        res.status(500).send({
            message: error.message,
            error
        });
    })
});

const DB = 'mongodb+srv://priyanshu:appyfizz@cluster0.4arzow6.mongodb.net/backend?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);

mongoose
  .connect(DB)
  .then(() => {
    console.log('connection successful');
  })
  .catch((err) => console.log('no connection'));

app.listen('3000', err => {
    if (err)
        throw err
    console.log('Server started!')
});