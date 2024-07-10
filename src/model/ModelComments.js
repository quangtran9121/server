const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelComments = new Schema({
    id: { type: Number, default: 0 },
    username: { type: String, default: '' },
    comments: { type: String, default: '' },
    rating: { type: Number, default: 0 },
});

module.exports = mongoose.model('comments', ModelComments);
