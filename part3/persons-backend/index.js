require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const person = require('./models/person')
const app = express()

morgan.token('body', (req, res) => {
        return JSON.stringify(req.body)
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name == 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    }
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    const time = new Date()
    Person.countDocuments({}).then(count => {
        res.send(`<p>Phonebook has info for ${count} people</p><p>${time}</p>`)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
/*
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }*/
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(result =>{
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (req, res) => {
    const body = req.body
    if(!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }
    
    /*
    if(persons.filter(person => person.name === body.name).length !== 0) {
        return res.status(400).json({
            error: `${body.name} already exists in the phonebook`
        })
    }*/

    const person = new Person({
        name: body.name, 
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})