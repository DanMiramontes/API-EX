const ERROR_HANDLERS = {
    CartError : res => 
    res.status(400).send({error: 'id used is malformed'}),

    validationError : (res, message) =>
    res.status(409).send({ error:message }),

    JsonWebTokenError: (res) =>
    res.status(401).json({error : 'token missing or invalid'}),
    
    TokenExpirerError: res =>
    res.status(401).json({error: 'token expiered'}),

    defaultError: res =>res.status(500).end() 

}


module.exports = (error, request, response, next) =>{
    console.error(error.name)
    const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
    handler(response, error)
    /*
    if(error.name === 'CastError'){
        response.status(400).send({error: 'id used is malformed'})   
    } else if(error.name === 'validationError'){
        response.status(409).send({
            error: error.message
        })
    } else if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({error : 'token missing or invalid'})
    }
    else {
        response.status(500).end() 
    }
    */
    
}