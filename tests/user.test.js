const mongoose  = require('mongoose')
const bcrypt = require('bcrypt')
const User = require("../models/User")
const { server } = require('../index')
const { api, getAllUser } = require('./helpers')


describe('creation a new user', ()=>{
    beforeEach(async () =>{
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('pswd',10)
        const user = new User({username:'devDaniel',passwordHash})

        await user.save()
    })

    test('Works as expected creating a fresh username', 
    async() =>{
        const usersAtStart = await getAllUser()

       const newUser = {
        username : 'danPrueba',
        name : 'Daniel',
        password : 'pasSworD'
       }

       await api
           .post('/api/users')
           .send(newUser)
           .expect(201)
           .expect('Content-Type',/application\/json/)

    const usersAtEnd = await getAllUser()

    expect(usersAtEnd).toHaveLength(usersAtStart.length +1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
    })

    test.skip('Creation fails with propers status code and message if username is already take', async()=>{
        const usersAtStart = await getAllUser()

        const newUser = {
            username:'devDaniel',
            name: 'Daniel',
            password : 'Password'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await getAllUser()
        expect(usersAtEnd).toHaveLength(usersAtStart.length +1)

        
    })
})


afterAll(()=>{
    mongoose.connection.close()
    server.close()
})