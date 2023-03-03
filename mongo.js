const mongoose = require('mongoose');
require('dotenv').config();
const password = process.env.MONGODB_PASSWORD;
const connectionString = `mongodb+srv://matiascartes:${password}@cluster0.fzahzod.mongodb.net/?retryWrites=true&w=majority`


mongoose.connect(connectionString)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    })


/*// Creamos una nueva persona
const person = new Person({
    name: 'Matias',
    number: '123456789'
})
// Guardamos la persona en la base de datos
person.save().then(result => {
    console.log('person saved!', result);
    mongoose.connection.close()})
    .catch(error => {
        console.log('error saving person:', error.message)}
    )*/

