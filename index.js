const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];

morgan.token('dataSent', function dataSent(req) {
    const data = JSON.stringify(req.body);
    if (data) return JSON.stringify(req.body);
    return null;
});

app.use(express.json());
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time :dataSent'
    )
);

app.use(cors());

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = +req.params.id;
    const person = persons.find((p) => p.id === id);
    person ? res.json(person) : res.status(404).end();
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

    if (!body || !body.name || !body.number) {
        return res.status(400).json({ error: 'the name or number is missing' });
    }

    if (persons.find((person) => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique',
        });
    }

    const newEntry = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000),
    };

    persons = persons.concat(newEntry);
    res.json(newEntry);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
