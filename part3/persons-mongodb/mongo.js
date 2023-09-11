const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://dtchoi:${password}@cluster0.wzsqxrc.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 4) {
    console.log('password, name, or number is missing as argument')
    process.exit(1)
} else if (process.argv.length === 5) {
    const nameArg = process.argv[3]
    const numberArg = process.argv[4]

    const person = new Person({
        name: nameArg,
        number: numberArg,
    })

    person.save().then(result => {
        console.log(`added ${nameArg} number ${numberArg} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('use only arguments password name number')
    process.exit(1)
}