require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('dataSent', function dataSent(req) {
    const data = JSON.stringify(req.body);
    if (data) return JSON.stringify(req.body);
    return null;
});

app.use(express.json());
app.use(express.static('build'));
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time :dataSent'
    )
);

app.use(cors());

app.get('/api/persons', (req, res) => {
    Person.find({}).then((people) => {
        res.json(people);
    });
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(request.params.id).then((person) => {
        res.json(person);
    });
});

app.get('/info', (req, res) => {
    const date = new Date();
    const phoneEntries = persons.length;
    res.send(
        `
        <div>
            <p>Phonebook has info for ${phoneEntries} people </p>
            <p>${date}</p>
        </div>
        `
    );
});

app.delete('/api/persons/:id', (req, res) => {
    const id = +req.params.id;
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    console.log(body);

    if (!body || !body.name || !body.number) {
        return res.status(400).json({ error: 'the name or number is missing' });
    }

    // if (persons.find((person) => person.name === body.name)) {
    //     return res.status(400).json({
    //         error: 'name must be unique',
    //     });
    // }

    const newEntry = new Person({
        name: body.name,
        number: body.number,
    });

    newEntry.save().then((savedPerson) => {
        res.json(savedPerson);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
