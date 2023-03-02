const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use(
    morgan(":method :url :status :res[name-length] - :response-time ms :data")
);

morgan.token("data", (request) => {
    return request.method === "POST" ? JSON.stringify(request.body) : " "
});


let notes = [
    {id:1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {id:2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {id:3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {id:4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/persons", (req, res) => {
    res.json(notes);
});
app.get("/info", (req, res) => {
    res.send(`<p>Phonebook has info for ${notes.length} people</p>
    <p>${new Date()}</p>`);
});
app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});
app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
});
app.post("/api/persons", (req, res) => {
    const note = req.body;
    if (!note.name || !note.number) {
        return res.status(400).json({
            error: "name missing"
        });
    }
    if (notes.find(n => n.name === note.name)) {
        return res.status(400).json({
            error: "name must be unique"
        });
    }
    note.id = Math.floor(Math.random() * 1000000);
    notes = notes.concat(note);
    res.json(note);
});



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});