const { response } = require('express');
const express = require('express');
const router = express.Router();
const data = require("./Lab3-timetable-data.json");
const Joi = require('joi');
const app = express();

app.use(express.json());

const port = process.env.Port || 3000;

//makes courses with json file
var newData = JSON.stringify(data)
const courses = JSON.parse(newData);

//frontend
app.use('/', express.static('static'));

//console log for requests
app.use(function (req, res, next) {
  console.log(`${req.method} request for ${req.url}`);
  next();
})
 
//get all subject codes and descriptions
router.get('/', function (req, res) {
  const result = [];
  for(course of courses){
    result.push(course.subject,course.className);
  }
  res.send(result);
})

//get course using subject code
router.get('/:id', function (req, res) {
  //const course = courses.find(c => c.subject === req.params.class_nbr);
  //if(!course) return res.status(404).send('Course not found');
  const result = [];
  for(course of courses){
    if(course.subject==req.params.id){
      result.push(course.catalog_nbr);
    }
  }
  //courses.filter(course => course.subject.indexOf(req.params.id) !== -1);
  res.send(result);
});

//post course
router.post('/', function (req, res) {
  const { error } = validateCourse(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);

  const course = {
    id: courses.length + 1, 
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
})

//put method using id
router.put('/:id', function (req, res) {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course){
    const course = {
      id: parseInt(req.params.id), 
      name: req.body.name
    }
    courses.push(course);
    res.send(course);
    return;
  }
  
  const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);

  course.name = req.body.name;
  res.send(course);
})

//delete method using id
router.delete('/:id', function (req, res) {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('Course not found');
  
  const index = courses.indexOf(course);
  courses.splice(index,1);

  res.send(course);
});

//used for input sanitization
function validateCourse(course){
  const schema = {
    name: Joi.string().min(3).required()
  };

  return result = Joi.validate(course, schema);
}

//router
app.use('/api/courses', router);


//port listener
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});