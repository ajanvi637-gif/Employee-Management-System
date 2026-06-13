document.getElementById("employeeLoginForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/employees/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: data.message
            });

            return;
        }

        localStorage.setItem(
            "employee",
            JSON.stringify(data.employee)
        );

        localStorage.setItem(
    "token",
    data.token
);

        window.location.href = "employee-dashboard.html";

    } catch (error) {

        console.log(error);

        Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Backend not responding"
        });

    }

});



const form =
document.getElementById(
"employeeLoginForm"
);

form.addEventListener(
"submit",
async function(e){

e.preventDefault();

const username =
document.getElementById(
"username"
).value;

const password =
document.getElementById(
"password"
).value;

const response =
await fetch(
"http://localhost:5000/api/employees/login",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username,
password
})
}
);

const data =
await response.json();

if(response.ok){

localStorage.setItem(
"employee",
JSON.stringify(data.employee)
);

window.location.href =
"employee-dashboard.html";

}

else{

Swal.fire({
    icon: "error",
    title: "Login Failed",
    text: data.message
});

}

});