const express = require('express')
var morgan = require('morgan')
const app = express()

morgan.token('data', (req) => {
    return req.method === 'POST'
      ? JSON.stringify(req.body)
      : "not POST"
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('dist'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>This is a phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${Math.max(...persons.map(n => n.id))} people</p><p>${Date()}</p>`)
  })

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  } else if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  } else if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ 
        error: 'name must be unique' 
      })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * (1000000 - 5) + 5),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    console.log('no person with such id')
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})