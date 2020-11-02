const { response } = require('express');
const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

const port = process.env.Port || 3000;
 
const courses = [
  {id:1,name:'course1'},
  {id:2,name:'course2'},
  {id:3,name:'course3'}
];

app.get('/', function (req, res) {
  res.send('Hello World');
})
 
app.get('/api/courses', function (req, res) {
  res.send(courses);
})

app.get('/api/courses/:id', function (req, res) {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('Course not found');
  res.send(course);
});

app.post('/api/courses', function (req, res) {
  //const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);

  const course = {
    id: courses.length + 1, 
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
})

app.put('/api/courses/:id', function (req, res) {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('Course not found');
    
  

  const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);

  course.name = req.body.name;
  res.send(course);
})

app.delete('/api/courses/:id', function (req, res) {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('Course not found');
  
  const index = courses.indexOf(course);
  courses.splice(index,1);

  res.send(course);
});

function validateCourse(course){
  const schema = {
    name: Joi.string().min(3).required()
  };

  return result = Joi.validate(course, schema);
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});