const mongoose = require('mongoose');

// create schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
});

// create model
const bookModel = mongoose.model('books', bookSchema);

module.exports = bookModel;
