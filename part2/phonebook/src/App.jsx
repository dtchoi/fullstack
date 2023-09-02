import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilter] = useState('')

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName, 
      number: newNumber
    }
    if (!persons.some(person => person.name === newName)) {
      personService.create(personObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
        })
    } else {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(p => p.name === newName)
        personService.update(personObject, personToUpdate.id)
          .then(newPerson => {
            setPersons(persons.map(p => p.name !== newName ? p : personObject))
          })
      }
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const deletePerson = (id) => {  
    const personToDelete = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personService.remove(personToDelete.id)
        .then(removedPerson => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = filterText === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter handleFilterChange={handleFilterChange} filterText={filterText}/>
      <h2>Add a new</h2>
        <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber}/>
      <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
