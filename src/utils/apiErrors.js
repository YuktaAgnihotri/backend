class Apierror extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors =[],
        stack = "",
        data,

    ){
        super(message)     //This will overwrite the features of Error class
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success   = false
        this.errors = this.errors
    }
}

export {Apierror}