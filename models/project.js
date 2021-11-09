const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    blog: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = {Project};