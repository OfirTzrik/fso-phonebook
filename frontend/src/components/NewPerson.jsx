const NewPerson = ({submitHandler, newNameValue, newNameHandler, newNumberValue, newNumberHandler}) => {
    const updateNameField = (event) => {
		newNameHandler(event.target.value)
	}

	const updateNumberField = (event) => {
		newNumberHandler(event.target.value)
	}
    
    return (
        <form onSubmit={submitHandler}>
			<div>
				name: <input value={newNameValue} onChange={updateNameField} />
			</div>
			<div>
				number: <input value={newNumberValue} onChange={updateNumberField} />
			</div>
			<div>
			<button type="submit">add</button>
			</div>
		</form>
    )
}

export default NewPerson