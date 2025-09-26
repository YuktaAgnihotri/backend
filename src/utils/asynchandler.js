 export const  requestHandler =  (fn) => ()=>{
 (req , res ,next)
 }


const asyncHandler = (requestHandler) =>{
   return (req ,res ,next) => {
    Promise.resolve(requestHandler(req ,res ,next))     // 2nd way is to use promise syntax if the statement is true make 
                                            // the flag true (next) and pass to other command
    .catch((err)=> next(err))
   }
}


 export const Handler = (fn) => async ()=>{
    try {
        await fn (req ,res ,next) 
    } catch (error) {
        res.status(error.code || 500).json({
            success : false,
            message : error.message     // this  err status code is lengthy and will be used a lot 
                                      // so create a apierror handler file in utils so that it can handle all time of errors 
        })
        
    }
 }

 export {asyncHandler}