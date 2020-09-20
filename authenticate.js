//middleware function
function aurth(req,res,next) {
    console.log('Authenticate...'); 
    next();
}

module.exports = aurth;

