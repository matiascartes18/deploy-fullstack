const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('./mongo.js')


const app = express();
const Person = require('./models/Person.js');


app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use(
    morgan(":method :url :status :res[name-length] - :response-time ms :data")
);

morgan.token("data", (request) => {
    return request.method === "POST" ? JSON.stringify(request.body) : " "
});




app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    })
});
app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then((person) => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    })
        .catch(error => next(error));
});
app.get("/info", (req, res) => {
    Person.find({}).then((persons) => {
        res.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>`
        );
    });
});
app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndRemove(id).then(() => {
        res.status(204).end();
    })
        .catch(error => next(error));
});


app.post("/api/persons", (req, res, next) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing"
        });
    }
    const person = new Person({
        name: body.name,
        number: body.number
    });
    person.save().then(savedPerson => {
        return savedPerson.toJSON();
    })
    .then(savedAndFormattedPerson => {
        res.json(savedAndFormattedPerson);
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    const newPersonInfo = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(id, newPersonInfo, {new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(error => next(error));
})

app.use((req, res) => {
    res.status(404).send({error: "unknown endpoint"});
})
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});