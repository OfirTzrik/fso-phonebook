import { useState, useEffect } from "react"
import axios from "axios"
import bookService from "./services/book.js"
import Filter from "./components/Filter.jsx"
import NewPerson from "./components/NewPerson.jsx"
import DisplayPerson from "./components/DisplayPerson.jsx"
import Notification from "./components/Notification.jsx"

const App = () => {
	const [persons, setPersons] = useState([]) 
	const [newName, setNewName] = useState("")
	const [newNumber, setNewNumber] = useState("")
	const [searchedName, setSearchedName] = useState("")
    const [successNotification, setSuccessNotification] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const hook = () => {
        bookService.getAll().then(initialPersons => {
            setPersons(initialPersons)
        })
    }
    useEffect(hook, [])

	const addNewPerson = (event) => {
		event.preventDefault()
		const newPerson = {
			name: newName,
			number: newNumber
		}
		// Check if there is a person that stands out (already exists)
		if (!persons.every(((person) => person.name !== newPerson.name && person.number !== newPerson.number))) {
            const personToUpdate = persons.find(p => p.name == newPerson.name)
            bookService.update(personToUpdate, newPerson).then(returnedPerson => {
                if (returnedPerson) {
                    setPersons(persons.map(p => p.id !== personToUpdate.id ? p : returnedPerson))
                    setSuccessNotification(`Person '${returnedPerson.name}' number successfully updated`)
                    setTimeout(() => {
                        setSuccessNotification(null)
                    }, 5000)
                }
            }).catch(error => {
                if (error.response && error.response.status === 404) {
                    bookService.getAll().then(initialPersons => {
                        setPersons(initialPersons)
                    })
                    setErrorMessage(`Person '${personToUpdate.name}' was already removed from the server`)
                } else {
                    setErrorMessage(error.response?.data?.error || `Failed to update '${personToUpdate.name}'`)
                }
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            })
		} else {
            bookService.addNew(newPerson).then(response => {
                setPersons(persons.concat(response))
                setSuccessNotification(`Person '${response.name}' was successfully added`)
                setTimeout(() => {
                    setSuccessNotification(null)
                }, 5000)
            }).catch(error => {
                setErrorMessage(error.response.data.error)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            })
		}
		setNewName("")
		setNewNumber("")
	}

	const personsSearch = persons.filter((person) => person.name.includes(searchedName))

    // Find the person to delete based on their ID and delete them from json-server
    // and also from 'persons'
    const deletePersonFromPhonebook = (person) => {
        const personToDelete = persons.find(p => p.id == person.id)
        bookService.deletePerson(personToDelete.id).then(response => {
            if (response != null) {
                setPersons(persons.filter(p => p !== personToDelete))
            }
        })
    }

	return (
		<>
            <h2>Phonebook</h2>
            <Notification message={successNotification} />
            <Notification message={errorMessage} type="error" />
            <Filter value={searchedName} setHandler={setSearchedName} />
            <h2>add a new</h2>
            <NewPerson submitHandler={addNewPerson} newNameValue={newName} newNameHandler={setNewName} newNumberValue={newNumber} newNumberHandler={setNewNumber} />
            <h2>Numbers</h2>
            <div>
                {personsSearch.map(person => 
                    <DisplayPerson key={person.name + person.number} person={person} deleteHandler={deletePersonFromPhonebook} />
                )}
            </div>
		</>
	)
}

export default App