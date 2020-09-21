const config = require('config');
const helmet = require('helmet');//third party middleware module load
const morgan =require('morgan');//third party middleware module load
const courses = require('./routes/courses');
const home = require('./routes/home');
const logger = require('./middleware/logger');
const aurth = require('./middleware/authenticate');
const express = require('express');//this module return a fnction
const { static } = require('express');
const app = express();//call express function

app.set('view engine','pug');//set template enginge pug 
app.set('views','./views');//default
   
//which enviroment we work (devlopment/production/testing)
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);//for gatting enviroment(default undefine)
// console.log(`App: ${app.get('env')}`);//both for chaking enviroment(default devlopment)

//Third party middleware
app.use(helmet());

//configuration
console.log('Application Name: '+config.get('name'));
console.log('Mail Server: '+config.get('mail.host'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));//morgan print console http request
    console.log('morgan started....');
}

//builtin middleware
app.use(express.json());//parse json and set key and value into req.body and pass next middleware
app.use(express.urlencoded({extended:true}));//parse urlencoded (key=value&key=value) and set key value into req.body and pass next middleware
app.use(express.static('public'));//this middleware use to send clint all public asset like images,css etc.

//Custom  middleware
app.use(logger);//install middleware   
app.use(aurth); //install middleware    

//router install
app.use('/api/courses',courses);
app.use('/',home);


// listening port 3000
const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log(`server start at port ${port}`);

});