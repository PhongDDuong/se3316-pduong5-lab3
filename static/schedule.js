//button listeners
document.getElementById('search-courses').addEventListener('click', courseSearch);
document.getElementById('schedule-create').addEventListener('click', makeSchedule);
document.getElementById('schedule-delete').addEventListener('click', deleteSchedule);
document.getElementById('schedule-delete-all').addEventListener('click', deleteAllSchedules);
document.getElementById('add-course').addEventListener('click', checkCourse);


getCourses();
getSchedule()
//displaySchedule();
var scheduleNames = [];

function getCourses(){//populates with courses from json file
    clearArea("courses");

    fetch("/api/courses")
    .then(res => res.json()
    .then(data => {
        const location = document.getElementById('courses');
        data.forEach(e => {
            const table = document.createElement('table');
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.appendChild(document.createTextNode(`${e.subject}`));

            row.appendChild(cell);
            const cell2 = document.createElement('td');

            cell2.appendChild(document.createTextNode(`${e.className}`));

            row.appendChild(cell2);
            table.appendChild(row);
            location.appendChild(table);
            if(e.course_info[0].ssr_component=="LAB"){//colors labs
                table.id = "lab";
            }
            if(e.course_info[0].ssr_component=="TUT"){//colours tutorials
                table.id = "tut";
            }
        })
    })
    )
}

function getSchedule(){//populates choice drop down with availible schedules
    
    clearArea("schedules");

    fetch('/api/schedule')
    .then(res => res.json())
    .then(data => {
        scheduleNames=data;
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

function displaySchedule(){//shows the courses stored in a schedule
    clearArea('schedule-area');
    var empty = true;

    const schedule = document.getElementById('schedules').value;

    fetch('/api/schedule/'+ schedule, {
        method: 'GET',
    })
    .then(res =>  res.json())
    .then(data => {
        const subtitle = document.getElementById('subtitle');
        const location = document.getElementById('schedule-area');

        if(data[0].subject!==" " && typeof data[0].subject!== "undefined"){
            location.hidden = false;
            subtitle.hidden = false;
            var subjects = data[0].subject.split(",");
            var catalogNum = data[0].catalog_nbr.split(",");

            const ol = document.createElement('ol');
            const courseNum = document.createElement('p');
            courseNum.appendChild(document.createTextNode("Contains "+ subjects.length +" courses"));
            ol.appendChild(courseNum)
            
            for(i = 0 ; i< subjects.length ; i++){
                const option = document.createElement('p');
                option.appendChild(document.createTextNode(subjects[i]+", "+catalogNum[i]));
                ol.appendChild(option)
            }

            location.appendChild(ol);
        }
        else{ 
            const reponse = document.createElement('p');
            reponse.appendChild(document.createTextNode("No Courses"));
            location.appendChild(reponse);

        }
    });
}


function deleteSchedule(){//removes a schedule
    const input = {
        input: document.getElementById('schedules').value
    } 
    if(document.getElementById('schedules').value!="No Schedules"){
        fetch('/api/schedule/', {
            method: 'DELETE',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(input)
        })
        .then(res => {
            if(res.ok) {
                res.json()
                .then(data => console.log(data))
                .catch(err => console.log('failed to delete schedule'))
            }
            else{
                console.log('error: ',res.status)
            }
        })
    }
    else{
        alert("no schedules to delete")
    }
    getSchedule();
    displaySchedule()
}

function deleteAllSchedules(){//removes all schedules stored
    fetch('/api/schedule/all' , {
        method: 'DELETE',
    })
    if(document.getElementById('schedules').value=="No Schedules"){
        alert("no schedules to delete");
    }
    getSchedule();
    displaySchedule()
}

function makeSchedule(){//creates a schedule
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(document.getElementById('schedule-name').value)){//input validation
        alert("invalid characters used");
    }
    else{
        const schedule = {
            schedule: document.getElementById('schedule-name').value,
            subject: " ",
            catalog_nbr: " ",
        } 
        if(!(scheduleNames.includes(document.getElementById('schedule-name').value)) && document.getElementById('schedule-name').value!=="" ){
            fetch('/api/schedule/create',{
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(schedule)
            })
            .then(res => {
                if(res.ok) {
                    res.json()
                    .then(data => console.log(data))
                    .catch(err => console.log('failed to add course'))
                }
                else{
                    console.log('error: ',res.status)
                }
            })
            .catch()
        }
        else{
            alert("schedule already exists or nothing was entered");
        }
        getSchedule();
        displaySchedule();
    }
}

function checkCourse(){//check if the course being added is a real course
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(document.getElementById('courseSubject').value)||/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(document.getElementById('courseCatalog_nbr').value)){//input validation
        alert("invalid characters used");
    }
    else{
        var found = false;
        if(document.getElementById('schedules').value!="No Schedules"){
            fetch("/api/courses")
            .then(res => res.json()
            .then(data => {
                const l = document.getElementById("schedule-area");
                if(document.getElementById('courseSubject').value!=="" && document.getElementById('courseCatalog_nbr').value!==""){
                    data.forEach(e => {
                        if(document.getElementById('courseSubject').value==e.subject && document.getElementById('courseCatalog_nbr').value==e.catalog_nbr){
                            addCourse();
                            found = true;
                        }
                    })
                    if(found==false){
                        alert("Invalid course");
                    }
                }
                else{
                    alert("Invalid course");
                }
            })
            )
        }
        else{
            console.log("no schedule");
        }
    }

}

function addCourse(){//updates a schedule
    const schedule = {
        schedule: document.getElementById('schedules').value,
        subject: document.getElementById('courseSubject').value,
        catalog_nbr: document.getElementById('courseCatalog_nbr').value
    }
    fetch('/api/schedule',{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(schedule)
    })
    .then(res => {
        if(res.ok) {
            res.json()
            .then(data => console.log(data))
            .catch(err => console.log('failed to add course'))
        }
        else{
            console.log('error: ',res.status)
        }
    })
    .catch()
    displaySchedule();
}






function clearArea(area){//empties section of given location
    const node= document.getElementById(area);
    node.querySelectorAll('*').forEach(n => n.remove());
}

function courseSearch(){//searches through the courses when given certain parameters
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(document.getElementById('subject').value)||/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(document.getElementById('catalog_nbr').value)||/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(document.getElementById('ssr_component').value)){//input validation
        alert("invalid characters used");
    }
    else{
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
                    if(e.course_info[0].ssr_component=="LAB"){//colors lab
                        table.id = "lab";
                    }
                    if(e.course_info[0].ssr_component=="TUT"){//colors tutorials
                        table.id = "tut";
                    }
                }
            })
        }
        if(document.getElementById('subject').value!=="" && document.getElementById('catalog_nbr').value!=="" && document.getElementById('ssr_component').value==""){//search for timetable when not given course component
            data.forEach(e => {
                if(document.getElementById('subject').value==e.subject && document.getElementById('catalog_nbr').value==e.catalog_nbr){
                    const course = document.createElement('li');
                    course.appendChild(document.createTextNode(`${e.course_info[0].days}, ${e.course_info[0].start_time}, ${e.course_info[0].end_time}`))
                    l.appendChild(course);
                    found = true;
                }
            })
        }
        if(document.getElementById('subject').value!=="" && document.getElementById('catalog_nbr').value!=="" && document.getElementById('ssr_component').value!==""){//search for timetable when given course component
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
            const error = document.createElement('p');
            error.appendChild(document.createTextNode("No courses found"))
            l.appendChild(error);
        }
    })
    )
    }
    
}
