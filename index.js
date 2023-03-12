require('dotenv').config()
require('./mongo.js')

const express = require('express')
//const cors = require('cors')
const app = express()
const Note = require('./models/Note.js')
const handleErrors = require('./middleware/handleErrors.js')
const notFound = require('./middleware/notFound.js')
const usersRouter = require('./controllers/users')
const { request, response } = require('express')
const User = require('./models/User')

//app.use(cors())
app.use(express.json())



app.get('/', (request, response) =>{
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes',async (request,response)=>{
    const notes = await Note.find({}).populate('user',{
        username:1,
        name: 1
    })
     response.json(notes)

})

app.get('/api/notes/:id',(request,response,next) =>{
   const { id }= request.params
   Note.findById(id).then(note => {
    if(note){
        return response.json(note)
    }else {
        response.status(404).end()
    }

   }).catch(err =>next(err))


   /* short
      Note.findById(id).then(note => {
    if(note) return response.json(note)
    response.status(404).end()
    
   */

})

app.post('/api/notes', async(request, response,next)=>{
    const {
        content, 
        important= false,
        userId
    } = request.body

    const user = await User.findById(userId)

    if(!content){
        return response.status(400).json({
            error: 'required "content" field is missing'
        })
    }

    const newNote = new Note({
        content: content,
        date: new Date(),
        important,
        user: user._id

    })

 //   newNote.save().then(savedNote =>{
 //       response.json(savedNote)
 //   }).catch(err => next(err))
   try {
      const savedNote =  await newNote.save()

      user.notes = user.notes.concat(savedNote._id)
      await user.save()

      response.json(savedNote)
   }catch (eror){
      next(error)
   }


})
app.put('/api/notes/:id',(request,response,next) =>{
   const { id } = request.params
   const note = request.body
   const newNoteInfo = {
    content : note.content,
    important: note.important
   }

   Note.findByIdAndUpdate(id,newNoteInfo, { new: true })
       .then(result =>{
        response.json(result)
       }).catch(err => next(err))

})

app.delete('/api/notes/:id',(request, response,next)=>{
    const { id } = request.params
    Note.findByIdAndDelete(id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
   //await Note.findByIdAndDelete(id)
   //response.status(204).end()
    
})

app.use('/api/users',usersRouter)



app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
const server = app.listen(PORT, ()=>{
   console.log(`Server running on port ${PORT}`) 
})


module.exports = {app,server}