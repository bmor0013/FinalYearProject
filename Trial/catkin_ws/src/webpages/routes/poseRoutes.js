const mongoose = require('mongoose');

const Pose = require("../models/poseModel");

module.exports = {


    getAll: function (req, res) {
        Pose.find(function (err, poses) {
            if (err) {
                return res.json(err);
            } else {
                res.json(poses);
            }
        });
    },


    createOne: function (req, res) {
        let newPoseDetails = req.body;
        newPoseDetails._id = new mongoose.Types.ObjectId();
    
        let pose = new Pose(newPoseDetails);
        pose.save(function (err) {
            console.log('Done');
            res.json(pose);
        });
    },

    deleteOne: function (req, res) {
        pose.findOneAndRemove({ _id: req.params.name }, function (err) {
            if (err) return res.status(400).json(err);

            res.json();
        });
    },


};