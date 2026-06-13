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
        "http://localhost:5000/api/employees/dashboard-stats"
        );

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

    }

    catch(error){

        console.log(error);

    }

}

async function loadEmployees() {

    try {

        
         

        const response =
        await fetch(
        "http://localhost:5000/api/employees/all"
        );

        const employees =
        await response.json();

        allEmployees = employees;


        renderEmployees(employees);

    }

    catch(error){

        console.log(error);

    }

}

loadEmployees();
loadDashboardStats();



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
`http://localhost:5000/api/employees/update/${employeeId}`,
{
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
"http://localhost:5000/api/employees/add",
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

document.getElementById("employeeId").value = "";

loadEmployees();
loadDashboardStats();
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
`http://localhost:5000/api/employees/delete/${id}`,
{
method:"DELETE"
}
);

loadEmployees();
loadDashboardStats();
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
"http://localhost:5000/api/employees/all"
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
document.getElementById("task_description").value

};

await fetch(
"http://localhost:5000/api/employees/assign-task",
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

});

}

function renderEmployees(employees){

    employeeBody.innerHTML = "";

    employees.forEach(employee => {

        employeeBody.innerHTML += `

        <tr>

            <td>${employee.id}</td>

            <td>${employee.name}</td>

            <td>${employee.email}</td>

            <td>${employee.phone}</td>

            <td>

                <button onclick="editEmployee(${employee.id})">
                    Edit
                </button>

                <button onclick="deleteEmployee(${employee.id})">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

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