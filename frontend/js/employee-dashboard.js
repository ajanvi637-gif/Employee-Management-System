const employee =
JSON.parse(
localStorage.getItem("employee")
);

if (!employee) {

    window.location.href =
    "employee-login.html";

}

document.getElementById(
"profile"
).innerHTML = `

<h3>${employee.name}</h3>

<p>Email :
${employee.email}</p>

<p>Department :
${employee.department}</p>

<p>Designation :
${employee.designation}</p>

`;

async function loadTasks() {

   const token =
localStorage.getItem("token");

const response =
await fetch(
`http://localhost:5000/api/employees/tasks/${employee.id}`,
{
    headers: {
        Authorization: `Bearer ${token}`
    }
}
);

    const tasks =
    await response.json();

    const container =
    document.getElementById(
    "tasksContainer"
    );

    if(tasks.length === 0){

        container.innerHTML =
        "<h3>No Tasks Assigned</h3>";

        return;
    }

    container.innerHTML = "";

    tasks.forEach(task => {

       container.innerHTML += `

<div class="task-card">

    <h3>
    ${task.task_title}
    </h3>

    <p>
    ${task.task_description}
    </p>

    <span class="${
        task.status === "Completed"
        ? "completed"
        : "pending"
    }">

    ${task.status}

    </span>

    ${
        task.status === "Pending"
        ?

        `<button
        onclick="completeTask(${task.id})">
        Mark Complete
        </button>`

        : ""

    }

</div>

`;

    });

}


loadTasks();

async function completeTask(taskId){

await fetch(
`http://localhost:5000/api/employees/complete-task/${taskId}`,
{
method:"PUT"
}
);

Swal.fire({
    icon: "success",
    title: "Task Completed",
    text: "Great Job!",
    timer: 2000,
    showConfirmButton: false
});
loadTasks();

}


document
.getElementById(
"employeeLogout"
)
.addEventListener(
"click",
function(){

Swal.fire({

title:"Logout?",

icon:"question",

showCancelButton:true,

confirmButtonText:"Logout"

})
.then((result)=>{

if(result.isConfirmed){

localStorage.removeItem(
"employee"
);

localStorage.removeItem(
"token"
);

window.location.href =
"employee-login.html";

}

});

});
