document.getElementById('search-courses').addEventListener('click', courseSearch);
document.getElementById('schedule-create').addEventListener('click', makeSchedule);
document.getElementById('schedules').addEventListener('onchange', displaySchedule);
document.getElementById('schedule-display').addEventListener('click', displaySchedule);
document.getElementById('schedule-delete').addEventListener('click', deleteSchedule);
document.getElementById('schedule-delete-all').addEventListener('click', deleteAllSchedules);
document.getElementById('add-course').addEventListener('click', addCourse);


getCourses();
getSchedule();

function getCourses(){
    clearArea("courses");

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

function getSchedule(){

    clearArea("schedules");

    fetch('/api/schedule').then(res => res.json())
    .then(data => {
        const l = document.getElementById('schedules');
        var empty = true;

        data.forEach(e => {
            const option = document.createElement('option');
            option.appendChild(document.createTextNode(e));
            option.value = e;
            l.appendChild(option);
            empty = false;
            
        })
        if(empty){
            const l = document.getElementById('schedules');
            const option = document.createElement('option');
            option.appendChild(document.createTextNode("No Schedules"));
            option.value ="No Schedules";
            l.appendChild(option)
        }
        
    })
}

function makeSchedule(){
    const l = document.getElementById('schedule-name').value;
    fetch('/api/schedule/'+ l, {
        method: 'PUT',
    })
    .then(res => console.log(res))
    getSchedule();
}

function displaySchedule(){
    clearArea('schedule-area');
    
    const l = document.getElementById('schedules').value;
    fetch('/api/schedule/'+ l, {
        method: 'GET',
    })
    .then(res =>  res.json())
    .then(data => {
        const l = document.getElementById('schedule-area');
        const option = document.createElement('p');
        option.appendChild(document.createTextNode(data));
        l.appendChild(option);
        newCourses.push(data);
    });
}


function deleteSchedule(){
    const l = document.getElementById('schedules');
    console.log(l.value)
    fetch('/api/schedule/'+ l.value, {
        method: 'DELETE',
    })
    .then(res => console.log(res))
    getSchedule();
}

function deleteAllSchedules(){
    const l = document.getElementById('schedules');
    console.log(l.value)
    fetch('/api/schedule/' , {
        method: 'DELETE',
    })
    .then(res => console.log(res))
    getSchedule();
}

function addCourse(){
    /*
    fetch("/api/courses")
    .then(res => res.json()
    .then(data => {
        const l = document.getElementById("schedule-area");
        if(document.getElementById('courseSubject').value!=="" && document.getElementById('courseCatalog_nbr').value!==""){
            data.forEach(e => {
                if(document.getElementById('courseSubject').value==e.subject && document.getElementById('courseCatalog_nbr').value==e.catalog_nbr){
                    newCourses.push(e.subject,e.catalog_nbr);
                    updateSchedule(newCourses);

                }
            })
        }
        else{
            const error = document.createElement('li');
            error.appendChild(document.createTextNode("No courses found"))
            l.appendChild(error);
        }
    })
    )*/
    console.log("pls")
    displaySchedule();
}



function clearArea(area){
    const node= document.getElementById(area);
    node.querySelectorAll('*').forEach(n => n.remove());
}

function courseSearch(){
    getSchedule()
    var found = false;

    clearArea("courses");

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
                    course.appendChild(document.createTextNode(`${e.course_info[0].days}, ${e.course_info[0].start_time}, ${e.course_info[0].end_time}`))
                    l.appendChild(course);
                    found = true;
                }
            })
        }
        if(document.getElementById('subject').value!=="" && document.getElementById('catalog_nbr').value!=="" && document.getElementById('ssr_component').value!==""){
            data.forEach(e => {
                if(document.getElementById('subject').value==e.subject && document.getElementById('catalog_nbr').value==e.catalog_nbr && document.getElementById('ssr_component').value==e.course_info[0].ssr_component){
                    const course = document.createElement('li');
                    course.appendChild(document.createTextNode(`${e.course_info[0].days}, ${e.course_info[0].start_time}, ${e.course_info[0].end_time}`))
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
