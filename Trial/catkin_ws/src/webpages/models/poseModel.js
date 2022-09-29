const mongoose = require('mongoose');

const poseSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    data: {}
 
});

module.exports = mongoose.model('pose', poseSchema);