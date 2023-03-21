import inquirer from "inquirer";
import db from "./db/conn.js";

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  employee_tracker();
});

const employee_tracker = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "prompt",
        message: "Choose from the following options:",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Log Out",
        ],
      },
    ])
    .then((answers) => {
      if (answers.prompt === "View all departments") {
        db.query(`SELECT * FROM departments`, (err, result) => {
          if (err) throw err;
          console.log("Viewing all departments: ");
          console.table(result);
          employee_tracker();
        });
      } else if (answers.prompt === "View all roles") {
        db.query(`SELECT * FROM roles`, (err, result) => {
          if (err) throw err;
          console.log("Viewing all roles: ");
          console.table(result);
          employee_tracker();
        });
      } else if (answers.prompt === "View all employees") {
        db.query(`SELECT * FROM employees`, (err, result) => {
          if (err) throw err;
          console.log("Viewing all employees: ");
          console.table(result);
          employee_tracker();
        });
      } else if (answers.prompt === "Add a department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "department",
              message: "What is the name of the department?",
            },
          ])
          .then((answers) => {
            db.query(
              `INSERT INTO departments (name) VALUES (?)`,
              [answers.department],
              (err, result) => {
                if (err) throw err;
                console.log(`Added ${answers.department} to the database.`);
                employee_tracker();
              }
            );
          });
      } else if (answers.prompt === "Add a role") {
        db.query(`SELECT * FROM departments`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "role",
                message: "What is the name of the role?",
              },
              {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?",
                validate: (salaryInput) => {
                  if (salaryInput) {
                    return true;
                  } else {
                    console.log("Add a salary:");
                    return false;
                  }
                },
              },
              {
                type: "list",
                name: "department",
                message: "Which department does the role belong to?",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].name);
                  }
                  return array;
                },
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].name === answers.department) {
                  var department = result[i];
                }
              }

              db.query(
                `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                [answers.role, answers.salary, department.id],
                (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${answers.role} to the database.`);
                  employee_tracker();
                }
              );
            });
        });
      } else if (answers.prompt === "Add an employee") {
        db.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "What is the employees first name?",
              },
              {
                type: "input",
                name: "lastName",
                message: "What is the employees last name?",
              },
              {
                type: "list",
                name: "role",
                message: "What is the employees role?",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  var newArray = [...new Set(array)];
                  return newArray;
                },
              },
              {
                type: "input",
                name: "manager",
                message: "Who is the employees manager?",
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                  var role = result[i];
                }
              }

              db.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                [
                  answers.firstName,
                  answers.lastName,
                  role.id,
                  answers.manager_id,
                ],
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    `Added ${answers.firstName} ${answers.lastName} to the database.`
                  );
                  employee_tracker();
                }
              );
            });
        });
      } else if (answers.prompt === "Update an employee role") {
        db.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "Which employee do you want to update?",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(
                      `${result[i].first_name} ${result[i].last_name}`
                    );
                  }
                  return array;
                },
              },
              {
                type: "list",
                name: "role",
                message: "What is the employees new role?",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  var newArray = [...new Set(array)];
                  return newArray;
                },
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (
                  `${result[i].first_name} ${result[i].last_name}` ===
                  answers.employee
                ) {
                  var employee = result[i];
                }
                if (result[i].title === answers.role) {
                  var role = result[i];
                }
              }

              db.query(
                `UPDATE employee SET role_id = ? WHERE id = ?`,
                [role.id, employee.id],
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title}.`
                  );
                  employee_tracker();
                }
              );
            });
        });
      } else {
        console.log("Goodbye!");
        db.end();
      }
    });
};
