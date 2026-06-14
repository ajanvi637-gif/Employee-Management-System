const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

exports.updateEmployee = (req, res) => {

    const id = req.params.id;

    const {
        name,
        email,
        phone,
        department,
        designation,
        username
    } = req.body;

    const sql = `
    UPDATE employees
    SET
    name=?,
    email=?,
    phone=?,
    department=?,
    designation=?,
    username=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            name,
            email,
            phone,
            department,
            designation,
            username,
            id
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.status(200).json({
                message:"Employee Updated Successfully"
            });

        }
    );

};

exports.getEmployees = (req, res) => {

const sql = `

SELECT

employees.id,
employees.name,
employees.email,
employees.phone,
employees.department,
employees.designation,
employees.username,

COUNT(tasks.id) AS taskCount

FROM employees

LEFT JOIN tasks
ON employees.id = tasks.employee_id

GROUP BY employees.id

`;
    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);

    });

};
exports.addEmployee = async (req, res) => {

    const {
        name,
        email, 
        phone,
        department,
        designation,
        username,
        password
    } = req.body;

   db.query(
    "SELECT * FROM employees WHERE username=?",
    [username],
    async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        // STEP 2: hash password yaha karo
        const hashedPassword = await bcrypt.hash(password, 10);

        // STEP 3: insert yaha karo
        const sql = `
        INSERT INTO employees
        (
            name,
            email,
            phone,
            department,
            designation,
            username,
            password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                email,
                phone,
                department,
                designation,
                username,
                hashedPassword
            ],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "Employee Added Successfully"
                });

            }
        );
    }
);

};

exports.employeeLogin = async (req, res) => {

    const {
        username,
        password
    } = req.body;

   const sql =
"SELECT * FROM employees WHERE username=?";

db.query(
    sql,
    [username],   // YE MISSING THA
    async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Employee Not Found"
            });
        }

const employee = result[0];

const isMatch = await bcrypt.compare(
    password,
    employee.password
);

if (!isMatch) {
    return res.status(401).json({
        message: "Invalid Password"
    });
}

/* SAFE EMPLOYEE PEHLE BANAO */
const {
    password: pwd,
    ...safeEmployee
} = employee;

/* FIR TOKEN BANAO */
const token = jwt.sign(
    {
        id: safeEmployee.id,
        username: safeEmployee.username
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

res.status(200).json({
    message: "Login Successful",
    token,
    employee: safeEmployee
});

    }
);

};

exports.assignTask = (req,res)=>{

const {

employee_id,
task_title,
task_description,
priority,
due_date

} = req.body;

const sql = `
INSERT INTO tasks
(
employee_id,
task_title,
task_description,
priority,
due_date
)
VALUES
(?,?,?,?,?)
`;

db.query(
sql,
[
employee_id,
task_title,
task_description,
priority,
due_date
],
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.status(201).json({
message:
"Task Assigned Successfully"
});

});

};
exports.getEmployeeTasks = (req, res) => {

    const employeeId = req.params.id;

    const sql = `
    SELECT *
    FROM tasks
    WHERE employee_id = ?
    ORDER BY assigned_date DESC
    `;

    db.query(
        sql,
        [employeeId],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json(result);

        }
    );

};

exports.completeTask = (req, res) => {

    const taskId = req.params.id;

    const sql = `
    UPDATE tasks
    SET status='Completed'
    WHERE id=?
    `;

    db.query(
        sql,
        [taskId],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.status(200).json({
                message:"Task Completed"
            });

        }
    );

};

exports.getDashboardStats = (req, res) => {



    const stats = {};

    db.query(
        "SELECT COUNT(*) AS totalEmployees FROM employees",
        (err, employeeResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            stats.totalEmployees =
                employeeResult[0].totalEmployees;

            db.query(
                "SELECT COUNT(*) AS pendingTasks FROM tasks WHERE status='Pending'",
                (err, pendingResult) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    stats.pendingTasks =
                        pendingResult[0].pendingTasks;

                    db.query(
                        "SELECT COUNT(*) AS completedTasks FROM tasks WHERE status='Completed'",
                        (err, completedResult) => {

                            if (err) {
                                return res.status(500).json(err);
                            }

                            stats.completedTasks =
                                completedResult[0].completedTasks;

                            stats.activeEmployees =
                                stats.totalEmployees;

                            res.status(200).json(stats);

                        }
                    );
                }
            );
        }
    );
};

exports.getTopEmployees =
(req,res)=>{

const sql = `

SELECT

e.name,

COUNT(t.id)
AS completedTasks

FROM employees e

LEFT JOIN tasks t
ON e.id = t.employee_id

AND t.status='Completed'

GROUP BY e.id

ORDER BY completedTasks DESC

LIMIT 5

`;

db.query(
sql,
(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res
.status(200)
.json(result);

});
};

//__________

exports.getAllTasks = (req,res)=>{

const sql =
"SELECT * FROM tasks";

db.query(
sql,
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.status(200).json(result);

});

};

// ______________

exports.deleteEmployee = (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM employees WHERE id=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            message: "Employee Deleted Successfully"
        });

    });
};