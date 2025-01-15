const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :response-time :status :post-body', {
    skip: function (req, res) { return req.method !== 'POST' }
}))

morgan.token('post-body', function getContents(req) {
    return JSON.stringify(req.body)
})

const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))

let data = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = data.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const timestamp = new Date().toString()
    // console.log(timestamp)

    response.send(`<div>Phonebook has info for ${data.length} people</div><br></br><div>${timestamp}</div>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    }

    if (data.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    data = data.concat(person)

    // console.log(person)
    response.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})