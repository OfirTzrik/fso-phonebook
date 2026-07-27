require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const Contact = require("./models/phonebook.js")

app.use(express.json())
app.use(cors())
app.use(express.static("dist"))

morgan.token("body", (req) => JSON.stringify(req.body))
app.use(morgan(":date[web] - :method :url :status :res[content-length] - :response-time ms :body"))

let contacts = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.get("/api/persons", (req, res) => {
    Contact.find({}).then(contact => {
        res.json(contact)
    })
})

app.get("/api/persons/:id", (req, res) => {
    Contact.findById(req.params.id).then(contact => {
        res.json(contact)
    })
})

app.delete("/api/persons/:id", (req, res, next) => {
    Contact.findByIdAndDelete(req.params.id).then(result => {
        res.status(204).end()
    }).catch(error => next(error))
})

app.post("/api/persons", (req, res) => {
    const body = req.body

    if (!body["name"] || !body["number"]) {
        return res.status(400).json({
            error: "content missing"
        })
    }

    if (contacts.find(c => c.name === body["name"])) {
        return res.status(400).json({
            error: "name already exists"
        })
    }

    const contact = new Contact({
        "name": body["name"],
        "number": body["number"]
    })

    contact.save().then(savedContact => {
        res.json(savedContact)
        console.log(`New contact saved ${savedContact}`)
    })
})

app.get("/info", (req, res) => {
    const numContacts = contacts.length
    const time = new Date().toString()

    res.send(`<p>Phonebook has info for ${numContacts} people</p><p>${time}</>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: "unknown endpoint"
    })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    }

    next(error)
}

app.use(errorHandler)