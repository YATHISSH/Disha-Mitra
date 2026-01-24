const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

// Counter Schema for auto-increment IDs
const counterSchema = mongoose.Schema({
    name: { type: String, unique: true, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Function to get next ID
const getNextId = async (modelName) => {
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: modelName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        return counter.seq;
    } catch (error) {
        console.error('Error getting next ID:', error);
        throw error;
    }
};

module.exports = { getNextId, Counter };
