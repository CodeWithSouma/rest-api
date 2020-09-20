//middleware function  
function log(req,res,next) {//three parameter req,res next
    console.log('Logging...'); 
    next();
 }

 module.exports = log;