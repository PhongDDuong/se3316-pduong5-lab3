document.getElementById('search-courses').addEventListener('click', courseSearch);
document.getElementById('add-courses').addEventListener('click', addCourse);
getCourses();

function getCourses(){
    var node= document.getElementById("courses");
    node.querySelectorAll('*').forEach(n => n.remove());

    fetch("/api/courses")
    .then(res => res.json()
    .then(data => {
        console.log(data);
        const l = document.getElementById('courses');
        data.forEach(e => {
            const table = document.createElement('table');
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.appendChild(document.createTextNode(`${e.subject}`))

            row.appendChild(cell)
            const cell2 = document.createElement('td');

            cell2.appendChild(document.createTextNode(`${e.className}`))

            row.appendChild(cell2)
            table.appendChild(row)
            l.appendChild(table);

            //const br = document.createElement('br');
            //l.appendChild(br);
        })
    })
    )
}

function courseSearch(){
    var found = false;

    var node= document.getElementById("courses");
    node.querySelectorAll('*').forEach(n => n.remove())

    fetch("/api/courses")
    .then(res => res.json()
    .then(data => {
        console.log(data);
        const l = document.getElementById('courses');
        if(document.getElementById('subject').value!=="" && document.getElementById('catalog_nbr').value=="" && document.getElementById('ssr_component').value==""){
            data.forEach(e => {
                if(document.getElementById('subject').value==e.subject){
                    const course = document.createElement('li');
                    course.appendChild(document.createTextNode(`${e.catalog_nbr}`))
                    l.appendChild(course);
                    found = true;
                }
            })
        }
        if(document.getElementById('subject').value!=="" && document.getElementById('catalog_nbr').value!=="" && document.getElementById('ssr_component').value==""){
            data.forEach(e => {
                if(document.getElementById('subject').value==e.subject && document.getElementById('catalog_nbr').value==e.catalog_nbr){
                    const course = document.createElement('li');
                    course.appendChild(document.createTextNode(`${e.course_info[0].start_time}, ${e.course_info[0].end_time}`))
                    l.appendChild(course);
                    found = true;
                }
            })
        }
        if(document.getElementById('subject').value!=="" && document.getElementById('catalog_nbr').value!=="" && document.getElementById('ssr_component').value!==""){
            data.forEach(e => {
                if(document.getElementById('subject').value==e.subject && document.getElementById('catalog_nbr').value==e.catalog_nbr && document.getElementById('ssr_component').value==e.course_info[0].ssr_component){
                    const course = document.createElement('li');
                    course.appendChild(document.createTextNode(`${e.course_info[0].start_time}, ${e.course_info[0].end_time}`))
                    l.appendChild(course);
                    found = true;
                }
            })
        }
        if(found == false){
            const error = document.createElement('li');
            error.appendChild(document.createTextNode("No courses found"))
            l.appendChild(error);
        }
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