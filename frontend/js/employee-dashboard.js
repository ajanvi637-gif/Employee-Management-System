let allTasks = [];

if(
!localStorage.getItem("token")
){

window.location.href =
"employee-login.html";

}

const employee =
JSON.parse(
localStorage.getItem("employee")
);

if(!employee){

window.location.href =
"employee-login.html";

}

document.getElementById(
"welcomeText"
).innerText =
`Welcome ${employee.name}`;

document.getElementById(
"profile"
).innerHTML =
`

<p><b>Name:</b> ${employee.name}</p>

<p><b>Email:</b> ${employee.email}</p>

<p><b>Phone:</b> ${employee.phone}</p>

<p><b>Department:</b> ${employee.department}</p>

<p><b>Designation:</b> ${employee.designation}</p>
`;

document.getElementById(
"employeeName"
).innerText =
employee.name;

document.getElementById(
"employeeDepartment"
).innerText =
employee.department;

const quotes = [

"Success is the sum of small efforts.",

"Discipline beats motivation.",

"Small progress is still progress.",

"Stay focused.",

"Never give up."

];

document.getElementById(
"motivationText"
).innerText =

quotes[
Math.floor(
Math.random() * quotes.length
)
];

document.getElementById(
"logoutBtn"
)
.addEventListener(
"click",
function(){

localStorage.removeItem(
"employee"
);

localStorage.removeItem(
"token"
);

window.location.href =
"employee-login.html";

});


// ______________________________________

function updateRank(completedTasks){

const rank =
document.getElementById(
"employeeRank"
);

if(!rank) return;

if(completedTasks >= 10){

rank.innerText =
"🏆 Gold Employee";

}

else if(completedTasks >= 5){

rank.innerText =
"🥈 Silver Employee";

}

else{

rank.innerText =
"🥉 Bronze Employee";

}

}

// _____________________________________


function updateStreak(completedTasks){

const streak =
document.getElementById(
"streakValue"
);

if(!streak) return;

streak.innerText =
`🔥 ${completedTasks} Tasks Completed`;

}
// _____________________________________

function updatePerformanceRating(
percentage
){

const rating =
document.getElementById(
"performanceRating"
);

if(!rating) return;

if(percentage >= 90){

rating.innerText =
"🏆 Excellent";

}

else if(percentage >= 70){

rating.innerText =
"⭐ Very Good";

}

else if(percentage >= 50){

rating.innerText =
"👍 Good";

}

else{

rating.innerText =
"📚 Beginner";

}

}

// _________________________________________'

function updateLevel(completed){

const level =
document.getElementById(
"employeeLevel"
);
if(!level) return;

if(completed >= 20){

level.innerText =
"Level 4 🚀";

}

else if(completed >= 10){

level.innerText =
"Level 3 ⭐";

}

else if(completed >= 5){

level.innerText =
"Level 2 🔥";

}

else{

level.innerText =
"Level 1 🌱";

}

}

// ___________________________________

function updateAchievements(completed){

const container =
document.getElementById(
"achievementContainer"
);

if(!container) return;

container.innerHTML = "";

if(completed === 0){

container.innerHTML =
"<div>No Achievements Yet</div>";

return;

}

if(completed >= 1){

container.innerHTML +=
"<div>🏅 First Task</div>";

}

if(completed >= 5){

container.innerHTML +=
"<div>🥈 Productivity Star</div>";

}

if(completed >= 10){

container.innerHTML +=
"<div>🏆 Gold Performer</div>";

}

}

// ________________________________________

function loadActivity(tasks){

const container =
document.getElementById(
"activityContainer"
);

if(!container) return;

container.innerHTML = "";

if(tasks.length === 0){

container.innerHTML =
"<p>No Activity Found</p>";

return;

}

tasks.slice(0,5).forEach(task=>{

container.innerHTML +=

`
<p>

${task.status === "Completed"
?
"✅"
:
"📋"
}

${task.task_title}

</p>
`;

});

}



// __________________________________________

function loadNotifications(tasks){

const container =
document.getElementById(
"notificationContainer"
);

if(!container) return;

const pending =
tasks.filter(
task =>
task.status === "Pending"
).length;

container.innerHTML =

`
<p>

🔔 You have

${pending}

pending tasks

</p>
`;

}

// _______________________________________


function loadUpcomingDeadlines(tasks){

const container =
document.getElementById(
"deadlineContainer"
);

if(!container) return;

if(tasks.length === 0){

container.innerHTML =
"<p>No Deadlines</p>";

return;

}

container.innerHTML = "";

tasks.forEach(task=>{

if(task.due_date){

container.innerHTML +=

`
<p>

📅

${task.task_title}

<br>

${new Date(
task.due_date
).toLocaleDateString()}

</p>
`;

}

});

}

// ____________________________________

function scrollToTasks(){

document
.querySelector(
".task-card"
)
.scrollIntoView({

behavior:"smooth"

});

}
// __________________________________________


async function loadTasks() {

    try {

        const response =
        await fetch(
`https://employee-management-system-1asj.onrender.com/api/employees/tasks/${employee.id}`        );

        const tasks =
        await response.json();
        console.log(tasks);
        allTasks = tasks;

        // ++++++++++++++++++++++++++

        renderTasks(tasks);
        loadActivity(tasks);
        loadNotifications(tasks);
        loadUpcomingDeadlines(tasks);

        // ++++++++++++++++++++++++++

        document.getElementById(
        "totalTasks"
        ).innerText =
        tasks.length;

        document.getElementById(
        "pendingTasks"
        ).innerText =
        tasks.filter(
        task =>
        task.status === "Pending"
        ).length;

        document.getElementById(
        "completedTasks"
        ).innerText =
        tasks.filter(
        task =>
        task.status === "Completed"
        ).length;

        const completed =
tasks.filter(
task =>
task.status === "Completed"
).length;

// ++++++++++++++++


updateRank(
completed
);

updateStreak(
completed
);

updateLevel(
completed
);

updateAchievements(
completed
);


// ++++++++++++++++
const percentage =
tasks.length === 0
?
0
:
Math.round(
(completed / tasks.length) * 100
);

updatePerformanceRating(
percentage
);

document.getElementById(
"progressFill"
).style.width =
percentage + "%";

document.getElementById(
"progressText"
).innerText =
percentage + "% Completed";     

document.getElementById(
"performanceText"
).innerText =

percentage +
"% Task Completion Rate";


// _______________

const meter =
document.getElementById(
"meterText"
);

if(percentage >= 90){

meter.innerText =
"Excellent 🚀";

}

else if(percentage >= 70){

meter.innerText =
"Very Good ⭐";

}

else if(percentage >= 50){

meter.innerText =
"Good 👍";

}

else{

meter.innerText =
"Needs Improvement 📚";

}
   

    }

    catch(error){

        console.log(error);

    }

}

// ________________________________

function renderTasks(tasks){

const taskContainer =
document.getElementById(
"taskContainer"
);

taskContainer.innerHTML = "";

if(tasks.length === 0){

taskContainer.innerHTML =

`
<h3>
No Tasks Assigned Yet
</h3>
`;

return;

}

tasks.forEach(task=>{

    const isOverdue =

task.status !== "Completed"

&&

task.due_date

&&

new Date(task.due_date)
<
new Date();

taskContainer.innerHTML +=

`

<div class="task-box
${isOverdue ? "overdue" : ""}
">

<h3>
${task.task_title}
</h3>

<p>
${task.task_description}
</p>

<p>

Priority :

<b>

${task.priority || "Normal"}

</b>

</p>

<p>

Due Date :

${
task.due_date
?
new Date(task.due_date)
.toLocaleDateString()
:
"N/A"
}

</p>

${
isOverdue
?

`
<p class="overdue-text">

⚠ Overdue Task

</p>
`

:

""
}

<p>

Status :

<b class="${
task.status === "Completed"
?
"completed"
:
"pending"
}">

${task.status}

</b>

</p>

${
task.status === "Pending"
?

`
<button
onclick="completeTask(${task.id})"
>

Mark Completed

</button>
`

:

""

}

</div>

`;

});

}

// _____________________________

async function completeTask(id){

await fetch(

`https://employee-management-system-1asj.onrender.com/api/employees/complete-task/${id}`,

{
method:"PUT"
}

);

loadTasks();

}

loadTasks();

document.getElementById(
"taskSearch"
).addEventListener(
"keyup",
function(){

const value =
this.value.toLowerCase();

const filtered =
allTasks.filter(task=>

task.task_title
.toLowerCase()
.includes(value)

);

renderTasks(filtered);

});

gsap.from(
".employee-header",
{
y:-50,
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





