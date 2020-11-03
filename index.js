const express = require('express');
var router = express.Router();
const data = require("./Lab3-timetable-data.json");
const Storage = require('node-storage');
const Joi = require('joi');
const app = express();

app.use(express.json());

var store = new Storage('schedule');

const asdasd = {
  id: "asd", 
  name: "asddasd"
}
store.put('banana', asdasd);
store.put('hello', "asdasdasdasddas");

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

//get all schedules
app.get('/api/schedule', (req, res) => {
  const result = [];

  for(schedule in store.store) {
    result.push(schedule);
  }
  res.send(result);
});


app.get('/api/schedule/:id', (req, res) => {
  res.send(store.get(req.params.id));
});

//put schedules
app.put('/api/schedule/:id', (req, res) => {
  store.put(req.params.id,"");

  var newData = JSON.stringify(store.store)
  const schedules = [JSON.parse(newData)];
  res.send(schedules);
});

app.put('/api/schedule/:id/:id2', (req, res) => {
  store.put(req.params.id,req.params.id2);

  var newData = JSON.stringify(store.store)
  const schedules = [JSON.parse(newData)];
  res.send(schedules);
});

app.delete('/api/schedule/', function (req, res) {

  for(schedule in store.store) {
    store.remove(schedule);
  }

  res.send("deleted");
});

app.delete('/api/schedule/:id', function (req, res) {

  store.remove(req.params.id);

  res.send("deleted");
});



//get all courses
router.get('/', (req, res) => {
  res.send(courses);
});

//add new course
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

//get one course using id
router.get('/:id', function (req, res) {

  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('Course not found');
  
  //courses.filter(course => course.subject.indexOf(req.params.id) !== -1);
  res.send(course);
});

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
