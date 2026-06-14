const taskBody =
document.getElementById(
"taskBody"
);

const form =
document.getElementById("employeeForm");

const employeeBody =
document.getElementById("employeeBody");

const adminLoggedIn =
localStorage.getItem(
"adminLoggedIn"
);

if(!adminLoggedIn){

window.location.href =
"admin-login.html";

}

// LOAD EMPLOYEES
let allEmployees = [];

async function loadDashboardStats() {

    try {

        const response =
        await fetch(
"https://employee-management-system-1asj.onrender.com/api/employees/dashboard-stats"        );

        const stats =
        await response.json();

        document.getElementById(
            "totalEmployees"
        ).innerText =
        stats.totalEmployees;

        document.getElementById(
            "pendingTasks"
        ).innerText =
        stats.pendingTasks;

        document.getElementById(
            "completedTasks"
        ).innerText =
        stats.completedTasks;

        document.getElementById(
            "activeEmployees"
        ).innerText =
        stats.activeEmployees;

        const total =

stats.completedTasks +
stats.pendingTasks;

loadChart(
stats.pendingTasks,
stats.completedTasks
);

const percentage =

total === 0
?
0
:
Math.round(
(stats.completedTasks / total)
*100
);

document.getElementById(
"companyProgress"
).style.width =
percentage + "%";

document.getElementById(
"companyProgressText"
).innerText =
percentage + "% Completed";

    }

    catch(error){

        console.log(error);

    }

}

async function loadTopEmployees(){

const response =
await fetch(
"https://employee-management-system-1asj.onrender.com/api/employees/top-employees"
);

const employees =
await response.json();

const list =
document.getElementById(
"topEmployees"
);

list.innerHTML = "";

employees.forEach(emp=>{

list.innerHTML +=

`

<li>

🏆

${emp.name}

-

${emp.completedTasks}

Tasks

</li>

`;

});

}

async function loadEmployees() {

    try {

        
         

        const response =
        await fetch(
"https://employee-management-system-1asj.onrender.com/api/employees/all"        );

        const employees =
        await response.json();

        allEmployees = employees;

        // __________________________

        renderEmployees(employees);
        loadRecentEmployees(employees);
        loadTopEmployees(employees);

      document.getElementById("employeeCount"
               ).innerText =
               employees.length;

    }

    catch(error){

        console.log(error);

    }

}


// ________________________

async function loadTasks(){

const response =
await fetch(
"https://employee-management-system-1asj.onrender.com/api/employees/all-tasks");

const tasks =
await response.json();

renderTasks(tasks);

}

// _________________________

function renderTasks(tasks){

taskBody.innerHTML = "";

tasks.forEach(task=>{

taskBody.innerHTML +=

`

<tr>

<td>
${task.id}
</td>

<td>
${task.employee_id}
</td>

<td>
${task.task_title}
</td>

<td>
${task.status}
</td>

</tr>

`;

});

}

// ________________________

let taskChart;

function loadChart(
pending,
completed
){

const ctx =
document.getElementById(
"taskChart"
);

if(!ctx) return;

if(taskChart){

taskChart.destroy();

}

taskChart =
new Chart(ctx, {

type:"doughnut",

data:{

labels:[

"Pending",
"Completed"

],

datasets:[{

data:[

pending,
completed

],

backgroundColor:[

"#ff9800",
"#4caf50"

]

}]

}

});

}

// _________________________


loadEmployees();
loadDashboardStats();
loadTasks();



// ADD EMPLOYEE

form.addEventListener("submit",

async function(e){

e.preventDefault();

const employeeData = {

name:
document.getElementById("name").value,

email:
document.getElementById("email").value,

phone:
document.getElementById("phone").value,

department:
document.getElementById("department").value,

designation:
document.getElementById("designation").value,

username:
document.getElementById("username").value,

password:
document.getElementById("password").value

};

const employeeId =
document.getElementById("employeeId").value;

if(employeeId){

await fetch(
`https://employee-management-system-1asj.onrender.com/api/employees/update/${employeeId}`{
method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(employeeData)
}
);

}

else{

await fetch(
"https://employee-management-system-1asj.onrender.com/api/employees/add"
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(employeeData)
}
);

}



form.reset();

document.querySelector(
"#employeeForm button"
).innerText =
"Add Employee";

document.getElementById("employeeId").value = "";

loadEmployees();

loadDashboardStats();

loadTasks();

Swal.fire({
    icon: "success",
    title: "Success",
    text: "Employee Added Successfully",
    timer: 2000,
    showConfirmButton: false
});

});

// DELETE EMPLOYEE

async function deleteEmployee(id){

const result = await Swal.fire({
    title: "Delete Employee?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel"
});

if (!result.isConfirmed) return;

await fetch(
`https://employee-management-system-1asj.onrender.com/api/employees/delete/${id}`
{
method:"DELETE"
}
);

loadEmployees();
loadDashboardStats();
loadTasks();
Swal.fire({
    icon: "success",
    title: "Deleted",
    text: "Employee Deleted Successfully",
    timer: 2000,
    showConfirmButton: false
});

}

async function editEmployee(id){

const response =
await fetch(
"https://employee-management-system-1asj.onrender.com/api/employees/all"
);

const employees =
await response.json();

const employee =
employees.find(
emp => emp.id === id
);

document.getElementById("employeeId").value =
employee.id;

document.getElementById("name").value =
employee.name;

document.getElementById("email").value =
employee.email;

document.getElementById("phone").value =
employee.phone;

document.getElementById("department").value =
employee.department;

document.getElementById("designation").value =
employee.designation;

document.getElementById("username").value =
employee.username;

document.querySelector(
"#employeeForm button"
).innerText =
"Update Employee";

window.scrollTo({
top:0,
behavior:"smooth"
});

}

const taskForm =
document.getElementById("taskForm");

if(taskForm){

taskForm.addEventListener(
"submit",
async function(e){

e.preventDefault();

const taskData = {

employee_id:
document.getElementById("employee_id").value,

task_title:
document.getElementById("task_title").value,

task_description:
document.getElementById("task_description").value,

priority:
document.getElementById("priority").value,

due_date:
document.getElementById("due_date").value

};

await fetch(
"https://employee-management-system-1asj.onrender.com/api/employees/assign-task"
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(taskData)
}
);

Swal.fire({
icon:"success",
title:"Task Assigned",
text:"Task Assigned Successfully",
timer:2000,
showConfirmButton:false
});

taskForm.reset();

loadTasks();

loadDashboardStats();

});

}

// _______________________________________

function renderEmployees(employees){

    document.getElementById(
"employeeCount"
).innerText =
employees.length;

    employeeBody.innerHTML = "";

    employees.forEach(employee => {

       employeeBody.innerHTML += `

<tr>

<td>${employee.id}</td>

<td>${employee.name}</td>

<td>${employee.email}</td>

<td>${employee.phone}</td>

<td>
${employee.taskCount || 0}
</td>

<td>

<button onclick="editEmployee(${employee.id})">
Edit
</button>

<button onclick="deleteEmployee(${employee.id})">
Delete
</button>

<button onclick="viewTasks(${employee.id})">
Tasks
</button>

</td>

<td>
${employee.department}
</td>

<td>
${employee.designation}
</td>

</tr>

`;
    });

}

// __________________________

function loadTopEmployees(employees){

const container =
document.getElementById(
"topEmployees"
);

if(!container) return;

container.innerHTML = "";

employees
.slice(0,5)
.forEach(employee=>{

container.innerHTML +=

`
<li>

🏆 ${employee.name}

</li>
`;

});

}


// ___________________________


async function viewTasks(id){

const response =
await fetch(
`https://employee-management-system-1asj.onrender.com/api/employees/tasks/${id}`
);

const tasks =
await response.json();

let html = "";

tasks.forEach(task=>{

html += `

<div style="
padding:10px;
border-bottom:1px solid #ddd;
">

<h3>${task.task_title}</h3>

<p>${task.task_description}</p>

<p>Status :
${task.status}
</p>

</div>

`;

});

Swal.fire({

title:"Employee Tasks",

html:html,

width:"700px"

});

}
// __________________________

function loadRecentEmployees(employees){

const container =
document.getElementById(
"recentEmployees"
);

if(!container) return;

container.innerHTML = "";

employees
.slice(-5)
.reverse()
.forEach(employee=>{

container.innerHTML +=

`
<div class="recent-card">

<h4>👤 ${employee.name}</h4>
<p>🏢 ${employee.department}</p>
</div>
`;

});

}

// ____________________________

// SEARCH EMPLOYEE

document
.getElementById("searchEmployee")
.addEventListener(
"keyup",
function(){

    const searchText =
    this.value.toLowerCase();

    const filteredEmployees =
    allEmployees.filter(employee =>

        employee.name
        .toLowerCase()
        .includes(searchText)

        ||

        employee.email
        .toLowerCase()
        .includes(searchText)

        ||

        employee.department
        .toLowerCase()
        .includes(searchText)

    );

    renderEmployees(filteredEmployees);

});

// FILTER BY DEPARTMENT

document
.getElementById("departmentFilter")
.addEventListener(
"change",
function(){

    const department =
    this.value;

    if(department === "All"){

        renderEmployees(allEmployees);

        return;

    }

    const filteredEmployees =
    allEmployees.filter(
        employee =>

        employee.department ===
        department
    );

    renderEmployees(filteredEmployees);

});

document
.getElementById(
"logoutBtn"
)
.addEventListener(
"click",
function(){

Swal.fire({

title:"Logout?",

text:"Do you want to logout?",

icon:"question",

showCancelButton:true,

confirmButtonText:"Logout"

})
.then((result)=>{

if(result.isConfirmed){

localStorage.removeItem(
"adminLoggedIn"
);

window.location.href =
"admin-login.html";

}

});

});

document
.getElementById(
"exportCSV"
)
.addEventListener(
"click",
function(){

let csv =
"ID,Name,Email,Phone,Department,Designation,Username\n";

allEmployees.forEach(employee=>{

csv +=
`${employee.id},
${employee.name},
${employee.email},
${employee.phone},
${employee.department},
${employee.designation},
${employee.username}\n`;

});

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

const url =
window.URL.createObjectURL(
blob
);

const a =
document.createElement("a");

a.href = url;

a.download =
"employees.csv";

a.click();

});

setInterval(()=>{

loadEmployees();

loadDashboardStats();

},10000);


window.addEventListener(
"load",
()=>{

setTimeout(()=>{

document.getElementById(
"loader"
).style.display =
"none";

},800);

});



gsap.from(
".sidebar",
{
x:-100,
opacity:0,
duration:1
}
);

gsap.from(
".card",
{
opacity:0,
duration:1,
stagger:0.2
}
);

gsap.from(
"table",
{
opacity:0,
duration:1.5
}
);