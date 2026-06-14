const express = require("express");
const auth =require("../middleware/auth");
const router = express.Router();

const {
    addEmployee,
    getEmployees,
    deleteEmployee,
    updateEmployee,
    employeeLogin,
    assignTask,
    getEmployeeTasks,
    completeTask,
    getDashboardStats,
    getTopEmployees,
    getAllTasks
} = require("../controllers/employeeController");

router.post("/add", addEmployee);

router.get("/all", getEmployees);

router.delete("/delete/:id", deleteEmployee);

router.put("/update/:id", updateEmployee);

router.post("/login", employeeLogin);

router.post("/assign-task",assignTask);

router.get(
"/tasks/:id",
getEmployeeTasks
);

router.put("/complete-task/:id",completeTask);

router.get(
"/dashboard-stats",
getDashboardStats
);

router.get(
"/top-employees",
getTopEmployees
);

router.get(
"/all-tasks",
getAllTasks
);

module.exports = router;