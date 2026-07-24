const DisplayPerson = ({person, deleteHandler}) => {
    return (
        <div>
            {`${person.name} ${person.number}`}
            <button onClick={() => deleteHandler(person)}>delete</button>
        </div>
    )
}

export default DisplayPerson