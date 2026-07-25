const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password (and optionally contact - name and number) as argument")
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.jcq4zof.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)
mongoose.connect(url, { family: 4 })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model("Contact", contactSchema)

if (process.argv.length == 3) {
    // Print all contacts
    console.log("phonebook:")
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length == 5) {
    // Add a new contact
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })

    contact.save().then(result => {
        console.log(result)
        console.log(`added ${contact["name"]} ${contact["number"]} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log("not enough or too many parameters passed")
    mongoose.connection.close()
}