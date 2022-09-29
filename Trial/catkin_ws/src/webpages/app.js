const express = require("express");
const path = require("path")
const mongoose = require("mongoose")
const poses = require('./routes/poseRoutes')


let app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use("/", express.static(path.join(__dirname, "dist/bonkoang")));

app.listen(4848)


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


mongoose.connect('mongodb://localhost:27017/poses', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');

});

app.get('/poses', poses.getAll);

app.post('/savePose', poses.createOne);

app.delete('/poseDelete/:name', poses.deleteOne);
