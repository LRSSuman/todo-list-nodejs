// import mongoose module
const mongoose = require('mongoose');

// go to mongodb atlas and create account and create database and get connection uri

const getDatabase = async () => {
    // you can get database directly by /database in url
    mongoose
        // you can use directly '%40' for '@' for url encode
        // otherwise use 'encodeURIComponent'
        .connect(
            'mongodb+srv://test:' +
                encodeURIComponent('test@123') +
                '@cluster0.ac6n5cs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
        )
        .then(() => {
            console.log('Database Connected');
        })
        .catch((err) => {
            console.log('Database Connection Error!', err.message);
        });
};

module.exports = {
    getDatabase,
};
