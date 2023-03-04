const mongoose = require('mongoose');

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const conectionString = process.env.MONGO_DB_URI

mongoose.connect(conectionString,connectionParams)
        .then(()=>{
            console.log('Database connected')
        }).catch(err=>{
            console.error(err)
        })

process.on('uncaughtException', () =>{
    mongoose.connection.disconnect()
})





