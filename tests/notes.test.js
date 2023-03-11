const mongoose  = require('mongoose')
const { server } = require('../index')
const Note = require('../models/Note')
const { api, initialNotes,getAllContetFromNote } = require('./helpers')




// antes del test
beforeEach(async ()=>{
    await Note.deleteMany({})

    for(const note of initialNotes){
        const notesObject = new Note(note)
        await notesObject.save()
    }
/*
    const notesObjects = initialNotes.map(note => newNote(note))
    const promises = notesObjects.map(note=>note.save())
    await promises.all(promises)


    const note1 = new Note(initialNotes[0])
    await note1.save()

    const note2 = new Note(initialNotes[1])
    await note2.save()

    const note3 = new Note(initialNotes[2])
    await note3.save()
*/
})
// tesst get
test('notes are returned as json',async()=>{
   await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type',/application\/json/)
})
test('there are two notes',async()=>{
  const response =  await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)

})

test('the first note is about...',async()=>{
    const response =  await api.get('/api/notes')
    expect(response.body[0].content).toBe('Prueba de notas 1')
  
})

test('the second note is false..',async()=>{
    const response =  await api.get('/api/notes')
    expect(response.body[1].important).toBe(false)
  
})


test('the second note content..',async()=>{
    const {
        contents
    } = await getAllContetFromNote()
    expect(contents).toContain('Prueba de notas 2')
  
})

//test post
test('a valid note can be added', async() =>{
    const newNote = {
        content  : 'Proxima nota',
        important: true
    }

    await api
         .post('/api/notes')
         .send(newNote)
         .expect(200)
         .expect('Content-Type',/application\/json/)

    const {contents, response } = await getAllContetFromNote()
    expect(response.body).toHaveLength(initialNotes.length + 1)

    expect(contents).toContain(newNote.content)
})

test('note without content is not added', async() =>{
    const newNote = {
        important: true
    }

    await api
         .post('/api/notes')
         .send(newNote)
         .expect(400)
         .expect('Content-Type',/application\/json/)

    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
   
})

// test delete

test('a note can be deleted', async()=>{
    const { response: firstResponse } = await getAllContetFromNote()
    const {body: notes} = firstResponse
    const noteToDelete = notes[0]
    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const { contents, response: secondResponse } = await getAllContetFromNote()
    expect(secondResponse.body).toHaveLength(initialNotes.length-1)

    expect(contents).not.toContain(noteToDelete.content)

})


test('a note that do not exist can not be delete',async()=>{
    const id = 1234
    await api
        .delete(`/api/notes/${id}`)
        .expect(400)
    const { response } = await getAllContetFromNote()
    expect(response.body).toHaveLength(initialNotes.length)

})



afterAll(()=>{
    mongoose.connection.close()
    server.close()
})