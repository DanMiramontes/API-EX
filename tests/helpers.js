const supertest = require('supertest')
const { app } = require('../index')
const  User  = require('../models/User')
const api = supertest(app)

const initialNotes = [
    {
       content: 'Prueba de notas 1',
       important: true,
       date: new Date()
    },
    {
       content: 'Prueba de notas 2',
       important: false,
       date: new Date()
    },
    {
       content: 'Prueba de notas 3',
       important: true,
       date: new Date()
    },
    {
        content: 'Prueba de notas 4',
        important: false,
        date: new Date()
     },
     {
        content: 'Prueba de notas 5',
        important: true,
        date: new Date()
     },
]

const getAllContetFromNote = async ()=>{
    const response =  await api.get('/api/notes')
    return{
         contents: response.body.map(note => note.content),
         response

    }
    

}

const getAllUser = async () =>{
   const usersDB = await User.find({})
   return usersDB.map(user => user.toJSON())
}

module.exports = {
    api,
    initialNotes,
    getAllContetFromNote,
    getAllUser
}