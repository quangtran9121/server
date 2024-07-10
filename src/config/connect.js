const Mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await Mongoose.connect("mongodb+srv://tranquangntch:LIX8LBflfaCuW6JB@cluster0.db2fde0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

module.exports = connectDB;
