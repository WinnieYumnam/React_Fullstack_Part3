const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors())

let persons = [
    { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
    },
    { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
    },
    { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
    },
    { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request,response) =>{
    response.json(persons);
})

app.get('/api/persons/:id', (request,response) =>{
    const personId = Number(request.params.id);
    const person = persons.find((item)=> 
    {
        console.log(personId);
        item.id === personId
    });
    console.log(person);
    if(person){
        response.json(person);
    }else {
        response.status(404).json({
            error: "Id not found"
        });

    }
})

app.get('/info', (request,response) =>{   
    const currentDate = new Date();

    // Create an array of month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get various date and time components
    const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: 'short' });
    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const timeZone = currentDate.toString().match(/\((.*?)\)/)[1];

    // Get the time zone offset in hours and minutes
    const timeZoneOffsetHours = Math.floor(currentDate.getTimezoneOffset() / 60);
    const timeZoneOffsetMinutes = Math.abs(currentDate.getTimezoneOffset() % 60);

    // Determine the sign of the time zone offset
    const timeZoneOffsetSign = timeZoneOffsetHours >= 0 ? '+' : '-';

    // Format the time zone offset as a string
    const timeZoneOffset = `${timeZoneOffsetSign}${Math.abs(timeZoneOffsetHours).toString().padStart(2, '0')}:${timeZoneOffsetMinutes.toString().padStart(2, '0')}`;

    // Create the formatted date string
    const formattedDate = `${dayOfWeek} ${month} ${day} ${year} ${hours}:${minutes}:${seconds} GMT${timeZoneOffset} (${timeZone})`;

    // Print the formatted date
    console.log(formattedDate);

    response.send(`Phonebook has info for ${persons.length} people <br/> ${formattedDate}`);
})

app.delete('/api/person/:id',(request,response) => {
    const personId = Number(request.params.id);
    persons = persons.filter(person => person.id !== personId)
    response.status(204).send(persons)
    // const index = persons.findIndex((person) => person.id === personId);
    // console.log(personId);
    // if(index !== -1){
    //     persons.splice(index,1);
    //     response.status(204).send(persons);
    // }else{
    //     response.status(404).send();
    // }
});

const generateId = () => {
    let id =  Math.floor(Math.random() * 100)+1;
    const checkId = persons.find(persons => persons.id === id);
    if (checkId) {
        id =  Math.floor(Math.random() * 100)+1;
    }
    return id;
}
app.use(morgan(':method :url :status - :response-time ms :res[content-length] '));
app.post('/api/persons',(request,response)=>{
    const body = request.body;
    const getName = body.name;
    console.log(body.name, body.number);
    console.log(typeof(getName));
    const checkName = persons.find(person=> person.name === getName);
    console.log("checkName",checkName);
    if(!body.name || !body.number){
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }
    else if (checkName !== undefined){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }      

    const note = {
        "id": generateId(),
        "name": body.name, 
        "number": body.number        
    }
    persons = persons.concat(note)

    response.json(persons)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)
});