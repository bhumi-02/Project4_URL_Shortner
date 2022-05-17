const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');
const mongoose=require("mongoose")


const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://Mouleshchavan:YpmtEPmAjBeUCOGG@cluster0.r5obc.mongodb.net/group_19_Database",    {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true
})
.then( () => console.log("Mongodb is connected"))
.catch( err => console.log(err))


app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});