const mongoose = require('mongoose');

// connecting mongodb
mongoose
    .connect('mongodb://127.0.0.1:27017/sample')
    .then(() => {
        console.log('Database connected');
    })
    .catch(() => {
        console.log('Database connection error');
    });

// creating schema
const addressSchema = new mongoose.Schema({
    city: String,
    street: String,
});

const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: 10,
        max: 40,
        validate: {
            validator: (v) => v % 2 == 0,
            message: (props) => `${props.value} is not a even number`,
        },
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        uppercase: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
    updatedAt: Date,
    bestFriend: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
    hobbies: [String],
    address: addressSchema,
});

// normal methods
userSchema.methods.sayHi = function () {
    console.log(`My name is ${this.name}`);
};

// static method
userSchema.statics.findByName = function (name) {
    return this.findOne({ name: name });
};

// query method
userSchema.query.byName = function (name) {
    return this.where({ name: name }).limit(1);
};

// schema virtuals
userSchema.virtual('namedEmail').get(function () {
    return `${this.name} <${this.email}>`;
});

// middleware
userSchema.pre('save', function (next) {
    this.name = `Mr. ${this.name}`;
    next();
});

userSchema.post('save', function (doc, next) {
    doc.name = `${doc.name} modified`;
    next();
});

const User = mongoose.model('user', userSchema);

const run = async () => {
    try {
        const user = await User.findById('65fbcc144a46f5110c4bec5f');
        user.name = 'wick';
        await user.save();

        console.log(user);
    } catch (err) {
        console.log(err.message);
    }
};
run();
