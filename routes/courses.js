const Joi = require('joi');
const express = require('express');
const router = express.Router();


const courses = [
    {id:1,name:'Course1'},
    {id:2,name:'Course2'},
    {id:3,name:'Course3'}
];


router.get('/',(req,res) => {
    res.send(courses);
});

router.get('/:id',(req,res) => {
    const course  = courses.find((course) => { return course.id === parseInt(req.params.id)});
    if (!course){
          res.status(404).send('Course with given ID was not found.');
          return;
    };
    res.send(course);
});

router.post('/',(req,res) => {
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

router.put('/:id',(req,res) => {

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

router.delete('/:id',(req,res) => {
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


module.exports = router;