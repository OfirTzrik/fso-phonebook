import axios from "axios"

const baseUrl = "/api//persons"

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const addNew = (newPerson) => {
    return axios.post(baseUrl, newPerson).then(response => response.data)
}

const deletePerson = (id) => {
    const answer = window.confirm("Are you sure you want to delete?")
    if (answer) {
        return axios.delete(`${baseUrl}/${id}`)
    } else {
        return Promise.resolve(null)
    }
}

const update = (personToUpdate, personNewNumber) => {
    const answer = window.confirm("Do you wish to update the number?")
    if (answer) {
        return axios.put(`${baseUrl}/${personToUpdate.id}`, personNewNumber).then(response => response.data)
    } else {
        return Promise.resolve(null)
    }
}

export default { getAll, addNew, deletePerson, update }
