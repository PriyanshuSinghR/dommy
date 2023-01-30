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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
    console.log('saved');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/', upload.single('file'), (req, res, next) => {
    csv()
    .fromFile(req.file.path)
    .then((jsonObj)=>{
        var army = [];
        for(var i = 0;i<jsonObj.length;i++){
            var obj={};
            obj.name=jsonObj[i]['Name'];
            obj.phone=jsonObj[i]['PhoneNo'];
            obj.rollNo=jsonObj[i]['RollNo'];
            army.push(obj);
        }
        userSchema.insertMany(army).then(function(){
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
            message: "failure",
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