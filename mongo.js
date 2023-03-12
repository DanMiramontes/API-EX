const mongoose = require('mongoose');
const Note = require('./models/Note');

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const {MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV} = process.env
//const conectionString = process.env.MONGO_DB_URI

//conexion a mongo

const conectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

mongoose.connect(conectionString,connectionParams)
        .then((result)=>{
            console.log('Database connected')
        }).catch(err=>{
            console.error(err)
        })


process.on('uncaughtException',error =>{
    console.error(error)
    mongoose.disconnect()
})



