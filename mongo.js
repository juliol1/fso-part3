const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide a password to connect to the Database');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://julio:${password}@phonebook.jftg3.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
    Person.find({}).then((result) => {
        console.log('phonebook:');
        result.forEach(({ name, number }) => {
            console.log(name, number);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length < 5) {
    console.log('Please input a number as an argument');
    mongoose.connection.close();
    process.exit(1);
} else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then(({ name, number }) => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}
