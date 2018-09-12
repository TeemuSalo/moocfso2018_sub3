const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')

app.use(bodyParser.json())
// app.use(morgan('tiny'))
morgan.token('req', function (req, res, part) { return JSON.stringify(req[part])})
app.use(morgan(':method :url :req[body] :status :res[content-length] - :response-time ms'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "lea kutvonen",
        "number": "109840124",
        "id": 4
    },
    {
        "name": "asko voimaleipä",
        "number": "123465789",
        "id": 5
    }
]

app.get('/api/persons', (req, res) => {
    // console.log('GET on persons')
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const reqId = Number(req.params.id)

    // console.log(`GET on person ${reqId}`)

    const person = persons.find(({ id }) => id === reqId)

    if (person) {

        // console.log(`Sending person ${person.name}`)
        res.json(person)

    } else {

        // console.log(`Requested ID ${reqId} not found`)
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const reqId = Number(req.params.id)

    const lengthBefore = persons.length

    // console.log(`DELETE on person ${reqId}`)

    persons = persons.filter(({ id }) => id !== reqId)

    const lengthAfter = persons.length

    const difference = lengthBefore - lengthAfter

    difference === 0 ? console.log('person not in array') : console.log('person deleted')

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {

    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    const nameExists = persons.find(({ name }) => name.toLocaleLowerCase() === body.name.toLocaleLowerCase())

    if (nameExists) {
        return res.status(400).json({ error: 'name already exists' })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000)
    }

    persons = persons.concat(newPerson)

    res.json(newPerson)
})

app.get('/info', (req, res) => {
    // console.log('GET info')
    const pLength = persons.length

    const msg = `<p>Puhelinluettelossa on ${pLength} henkilön tiedot</p>
                <p>${new Date()}</p>`
    res.send(msg)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})