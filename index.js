const Joi = require('joi');
const logger = require('./logger');
const aurth = require('./authenticate');
const express = require('express');
const { static } = require('express');
const app = express();
   
//builtin middleware
app.use(express.json());//parse json and set key and value into req.body and pass next middleware
app.use(express.urlencoded({extended:true}));//parse urlencoded (key=value&key=value) and set key value into req.body and pass next middleware
app.use(express.static('public'));//this middleware use to send clint all public asset like images,css etc.


//Custom  middleware
app.use(logger);//install middleware   
app.use(aurth); //install middleware    


const courses = [
    {id:1,name:'Course1'},
    {id:2,name:'Course2'},
    {id:3,name:'Course3'}
];

app.get('/',(req,res) => {
   res.send('Hello world!');
});

app.get('/api/courses',(req,res) => {
    res.send(courses);
});

app.get('/api/courses/:id',(req,res) => {
    const course  = courses.find((course) => { return course.id === parseInt(req.params.id)});
    if (!course){
          res.status(404).send('Course with given ID was not found.');
          return;
    };
    res.send(course);
});

app.post('/api/courses',(req,res) => {
      // validate if invalid return 400 -Bad request
      const {error} = validateCourse(req.body);

      //input validation using joi@13.1.0
      if(error){
          //400 bad request 
          res.status(400).send(error.details[0].message);
          return;
      }

    const course  = {
        id:courses.length + 1,
        name:req.body.name
    };
    courses.push(course);
    res.send(course);

});

app.put('/api/courses/:id',(req,res) => {

    //Lookup the course if not exist return 404
    const course  = courses.find((course) => { return course.id === parseInt(req.params.id)});
    if (!course){
          res.status(404).send('Course with given ID was not found.');
          return;
    };

    // validate if invalid return 400 -Bad request
    const {error} = validateCourse(req.body);

    //input validation using joi@13.1.0
    if(error){
        //400 bad request 
        res.status(400).send(error.details[0].message);
        return;
    }
    
    // update course
    course.name = req.body.name;
    // return updated course
    res.send(course);

});

app.delete('/api/courses/:id',(req,res) => {
    //Lookup the course if not exist return 404
    const course  = courses.find((course) => { return course.id === parseInt(req.params.id)});
    if (!course){
          res.status(404).send('Course with given ID was not found.');
          return;
    }

    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);

});


function validateCourse(course) {
    const schema = {
        name:Joi.string().min(3).required()
    }

    return Joi.validate(course,schema);
}



// listening port 3000
const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log(`server start at port ${port}`);

});