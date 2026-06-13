const form = document.getElementById("adminLoginForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if (
        username === "admin" &&
        password === "admin123"
    ) {

        localStorage.setItem(
              "adminLoggedIn",
                "true"
        );


        window.location.href =
            "admin-dashboard.html";
         }

    else {

        document.getElementById("error").innerText =
            "Invalid Username or Password";

    }

});