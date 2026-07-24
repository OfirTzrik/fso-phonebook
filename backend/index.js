const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())

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
    res.json(contacts)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const contact = contacts.find(c => c.id === id)

    if (contact) {
        res.json(contact)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    contacts = contacts.filter(c => c.id != id)

    res.status(204).end()
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

    const contact = {
        "id": Math.floor(Math.random() * 1000000).toString(),
        "name": body["name"],
        "number": body["number"]
    }

    contacts = contacts.concat(contact)
    
    res.json(contact)
})

app.get("/info", (req, res) => {
    const numContacts = contacts.length
    const time = new Date().toString()

    res.send(`<p>Phonebook has info for ${numContacts} people</p><p>${time}</>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: "unknown endpoint"
    })
}

app.use(unknownEndpoint)
