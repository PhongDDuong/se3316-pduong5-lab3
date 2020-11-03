document.getElementById('get-courses').addEventListener('click', courseSearch);
document.getElementById('add-courses').addEventListener('click', addCourse);
getCourses();

function getCourses(){
    var node= document.getElementById("courses");
    node.querySelectorAll('*').forEach(n => n.remove())
    fetch("/api/courses")
    .then(res => res.json()
    .then(data => {
        console.log(data);
        const l = document.getElementById('courses');
        data.forEach(e => {
            const course = document.createElement('li');
            course.appendChild(document.createTextNode(`${e.subject}, ${e.className}`))
            l.appendChild(course);
        })
    })
    )
}

function courseSearch(){
    var node= document.getElementById("courses");
    node.querySelectorAll('*').forEach(n => n.remove())

    fetch("/api/courses")
    .then(res => res.json()
    .then(data => {
        console.log(data);
        const l = document.getElementById('courses');
        data.forEach(e => {
            if(document.getElementById('id').value==e.subject){
                const course = document.createElement('li');
                course.appendChild(document.createTextNode(`${e.catalog_nbr}`))
                l.appendChild(course);
            }
        })
    })
    )
}


function addCourse(){
    const course = {
        //id: document.getElementById('id').value,
        name: document.getElementById('name').value
    }
    console.log(course);

    fetch('/api/courses', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(course)
    })
    .then(res =>{
        if(res.ok) {
            res.json()
            .then(data => {
                console.log(data);
                getCourses();
                document.getElementById('status').innerText = `Created course ${data.id}: ${data.name}`;
            })
                

            .catch(err => console.log("failure"))
        }
        else{
            console.log('Error: ', res.status)
            document.getElementById('status').innerText = 'Failed to add item';
        }
    })
    .catch()
}