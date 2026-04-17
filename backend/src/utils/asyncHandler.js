const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error); 
    }
};

export default asyncHandler;









// const asynHandler=(fn)=>async (req,res,next)=>{
//     try{
//         await fn(req,res,next); 

//     }
//     catch(error){
//         res.status(500).json({message:"Internal Server Error"});
//     }
// }