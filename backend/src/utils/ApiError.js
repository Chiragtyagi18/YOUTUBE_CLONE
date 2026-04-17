class ApiError extends Error {
    constructor(statusCode,message,data=null,errors=[],stack=""){
        super(message);
        this.statusCode=statusCode;
        this.data=data;
        this.success=false;
        this.message=message;
        this.errors=errors;
        if(stack){
            this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}
export default ApiError;