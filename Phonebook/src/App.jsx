
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'








const App = () => {


  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage]  = useState('')
  

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })

  }, [])

  

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some(
      person => person.name === newName
    )

    if (nameExists) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const personToUpdate = persons.find(
          person => person.name === newName
        )

        const updatedPerson = {
          ...personToUpdate,
          number: newNumber
        }

        personService
          .update(personToUpdate.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== personToUpdate.id ? person : returnedPerson
            ))
            setSuccessMessage(`Updated ${returnedPerson.name}'s number`)
            setTimeout(() => setSuccessMessage(''), 4000)
          })
          .catch(error => {
            setErrorMessage(error.response.data.error)
            setTimeout(() => setErrorMessage(''), 4000)
          })
      }
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setSuccessMessage(`${returnedPerson.name} is successfully added! `)
        setTimeout(() => setSuccessMessage(''), 4000)

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => setErrorMessage(''), 4000)
      })
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

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )


  
const deletePerson = (id, name) => {
  if (window.confirm(`Delete ${name}?`)) {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }
}


const Persons = ({ persons, deletePerson }) => (
  <div>
    {persons.map(person =>
      <p key={person.id}>
        {person.name} {person.number}
         <button onClick={() => deletePerson(person.id, person.name)}>
          delete
         </button>
        </p>
    )}
  </div>
)






  return (
    <div>
      
      <Notification 
      successMessage={successMessage}
      errorMessage={errorMessage}
      />
      <h2>Phonebook</h2>

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h2>Add a new</h2>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

     <li className="atom"><Persons persons={personsToShow}  deletePerson={deletePerson}  /></li>
     
    </div>
  )
}

export default App
