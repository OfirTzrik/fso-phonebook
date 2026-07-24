const Filter = ({value, setHandler}) => {
    const updateSearchedName = (event) => {
		setHandler(event.target.value)
	}

    return (
        <div>
			filter shown with <input value={value} onChange={updateSearchedName} />
		</div>
    )
}

export default Filter