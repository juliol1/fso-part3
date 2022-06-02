const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('connecting to ', url);

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: [true, 'User name is required'],
    },
    number: {
        type: String,
        required: [true, 'User phone number is required'],
        minlength: 8,
        validate: {
            validator: function (v) {
                if (v.includes('-')) {
                    const index = v.indexOf('-');
                    const firstHalf = v.slice(0, index);
                    const secondHalf = v.slice(index + 1);

                    const firstCondition =
                        firstHalf.length >= 2 && firstHalf.length <= 3;

                    const secondCondition =
                        !secondHalf.includes('-') && /^\d+$/.test(secondHalf);

                    return firstCondition && secondCondition ? true : false;
                } else {
                    return false;
                }
            },
            message: (props) => `${props.value} is not a valid phone number`,
        },
    },
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model('Person', personSchema);
