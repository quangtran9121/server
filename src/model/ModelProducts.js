const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelProducts = new Schema({
    id: { type: Number, default: 0 },
    img: { type: String, default: '' },
    nameProducts: { type: String, default: 0 },
    priceNew: { type: Number, default: 0 },
    des: { type: String, default: '' },
    checkProducts: { type: String, default: '' },
    checkType: { type: String, default: '' },
    quantityPro: { type: Number, default: 0 },
});

module.exports = mongoose.model('products', ModelProducts);
