document.getElementById('search-courses').addEventListener('click', courseSearch);
document.getElementById('schedule-create').addEventListener('click', makeSchedule);
document.getElementById('schedule-delete').addEventListener('click', deleteSchedule);
document.getElementById('schedule-delete-all').addEventListener('click', deleteAllSchedules);
document.getElementById('add-course').addEventListener('click', addCourse);


getCourses();
getSchedule();
//displaySchedule();

var newCourses = [];
const scheduleNames = [];

function getCourses(){
    clearArea("courses");

    fetch("/api/courses")
    .then(res => res.json()
    .then(data => {
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
            if(e.course_info[0].ssr_component=="LAB"){
                table.id = "lab";
            }
            if(e.course_info[0].ssr_component=="TUT"){
                table.id = "tut";
            }
        })
    })
    )
}

function getSchedule(){

    clearArea("schedules");

    fetch('/api/schedule').then(res => res.json())
    .then(data => {
        scheduleNames.push(data);
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
    if(!(scheduleNames[0].includes(document.getElementById('schedule-name').value)) && document.getElementById('schedule-name').value!=="" ){
        scheduleNames[0].push(document.getElementById('schedule-name').value);
        fetch('/api/schedule/'+ l, {
            method: 'PUT',
        })
        getSchedule();
    }
    else{
        alert("schedule already exists or nothing was entered");
    }
}

function updateSchedule(name){
    const l = document.getElementById('schedules').value;
    fetch('/api/schedule/'+ l+'/'+newCourses, {
        method: 'PUT',
    })
    displaySchedule()
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
        const ol1 = document.createElement('ol');
        newCourses = [];
        if(data!=""){
            newCourses.push(data);
        }
        const courseNum = document.createElement('p');
        courseNum.appendChild(document.createTextNode("Contains "+newCourses[0][0].split(",").length/2 +" courses"));
        ol1.appendChild(courseNum)

        for(i=0;i<newCourses[0][0].split(",").length;i+=2){
            const option = document.createElement('p');
            option.appendChild(document.createTextNode(newCourses[0][0].split(",")[i]+", "+newCourses[0][0].split(",")[i+1]));
            ol1.appendChild(option)
        }

        l.appendChild(ol1);
    });
}


function deleteSchedule(){
    const l = document.getElementById('schedules').value;
    if(document.getElementById('schedules').value!="No Schedules"){
        fetch('/api/schedule/'+ l, {
            method: 'DELETE',
        })
        .then(res => console.log(res))
    }
    else{
        console.log("no schedules to delete")
    }

    getSchedule();
    displaySchedule()
}

function deleteAllSchedules(){
    const l = document.getElementById('schedules');
    console.log(l.value)
    fetch('/api/schedule/' , {
        method: 'DELETE',
    })
    getSchedule();
    displaySchedule()
}

function addCourse(){
    if(document.getElementById('schedules').value!="No Schedules"){
        fetch("/api/courses")
        .then(res => res.json()
        .then(data => {
            const l = document.getElementById("schedule-area");
            if(document.getElementById('courseSubject').value!=="" && document.getElementById('courseCatalog_nbr').value!==""){
                data.forEach(e => {
                    if(document.getElementById('courseSubject').value==e.subject && document.getElementById('courseCatalog_nbr').value==e.catalog_nbr){
                        newCourses.push(e.subject,e.catalog_nbr)
                        updateSchedule()
                    }
                })
            }
            else{
                const error = document.createElement('li');
                error.appendChild(document.createTextNode("No courses found"))
                l.appendChild(error);
            }
        })
        )
    }
    else{
        console.log("no schedule")
    }
}



function clearArea(area){
    const node= document.getElementById(area);
    node.querySelectorAll('*').forEach(n => n.remove());
}

function courseSearch(){
    var found = false;

    clearArea("courses");

    fetch("/api/courses")
    .then(res => res.json()
    .then(data => {
        const l = document.getElementById('courses');
        if(document.getElementById('subject').value=="" && document.getElementById('catalog_nbr').value=="" && document.getElementById('ssr_component').value==""){
            getCourses();
        }
        if(document.getElementById('subject').value!=="" && document.getElementById('catalog_nbr').value=="" && document.getElementById('ssr_component').value==""){
            data.forEach(e => {
                if(document.getElementById('subject').value==e.subject){
                    const table = document.createElement('table');
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    cell.appendChild(document.createTextNode(`${e.catalog_nbr}`));
                    row.appendChild(cell);
                    table.appendChild(row);
                    l.appendChild(table);
                    found = true;
                    if(e.course_info[0].ssr_component=="LAB"){
                        table.id = "lab";
                    }
                    if(e.course_info[0].ssr_component=="TUT"){
                        table.id = "tut";
                    }
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
        if(found == false && !(document.getElementById('subject').value=="" && document.getElementById('catalog_nbr').value=="" && document.getElementById('ssr_component').value=="")){
            const error = document.createElement('li');
            alert("no courses found");
            error.appendChild(document.createTextNode("No courses found"))
            l.appendChild(error);
        }
    })
    )
}
