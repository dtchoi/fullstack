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
  const [notification, setNotification] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const Notification = ({message, successful}) => {
    if (message === null) {
      return null
    }

    if (successful) {
      return (
        <div className='success'>
          {message}
        </div>
      )
    } else {
      return (
        <div className='error'>
          {message}
        </div>
      )
    }

  }

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

          setNotification(
            `Added ${newName}`
          )

          setSuccess(true)
          
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setNotification(error.response.data.error)
          setSuccess(false)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })

    } else {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(p => p.name === newName)
        personService.update(personObject, personToUpdate.id)
          .then(newPerson => {
            setPersons(persons.map(p => p.name !== newName ? p : newPerson))

            setNotification(
              `Added ${newName}`
            )
            
            setSuccess(true)
    
            setTimeout(() => {
              setNotification(null)
            }, 5000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setNotification(error.response.data.error)
          setSuccess(false)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
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
        .catch(error => {
          setNotification(
            `Information of ${personToDelete.name} has already been removed from server`
          )
          setSuccess(false)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
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
        <Notification message={notification} successful={success}/>
        <Filter handleFilterChange={handleFilterChange} filterText={filterText}/>
      <h2>Add a new</h2>
        <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber}/>
      <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
