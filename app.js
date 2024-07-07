const express = require('express');
const app = express();
const exhbs = require('express-handlebars');
// import database object from db.js
const dbo = require('./db.js');
// import bookModel in bookModel.js
const BookModel = require('./models/bookModel.js');

// connect database
dbo.getDatabase();
// set engine
app.engine(
    'hbs',
    exhbs.engine({
        layoutsDir: 'views/',
        defaultLayout: 'main',
        extname: 'hbs',
        // handlebard to resolve error "own property" of its parent.
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    })
);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    let message = '',
        edit_id,
        edit_book;
    // read
    // db.collection.find();

    let books = await BookModel.find({});
    console.log(books);

    // update
    if (req.query.edit_id) {
        edit_id = req.query.edit_id;
        edit_book = await BookModel.findOne({ _id: edit_id });
    }

    // delete
    // db.collection.deleteOne({id...})
    if (req.query.delete_id) {
        await BookModel.deleteOne({ _id: req.query.delete_id });
        return res.redirect('/?status=3');
    }

    switch (req.query.status) {
        case '1':
            message = 'inserted successfully';
            break;
        case '2':
            message = 'updated successfully';
            break;
        case '3':
            message = 'deleted successfully';
            break;
        default:
            break;
    }

    res.render('main', { message, books, edit_id, edit_book });
});

app.post('/store_book', async (req, res) => {
    // assigning a data to bookModel
    const book = new BookModel({
        title: req.body.title,
        author: req.body.author,
    });
    // use save for insert
    book.save();
    return res.redirect('/?status=1');
});

app.post('/update_book/:edit_id', async (req, res) => {
    let edit_id = req.params.edit_id;
    await BookModel.findOneAndUpdate(
        { _id: edit_id },
        {
            title: req.body.title,
            author: req.body.author,
        }
    );
    return res.redirect('/?status=2');
});

app.listen('8080', () => {
    console.log('listening in 8080');
});
