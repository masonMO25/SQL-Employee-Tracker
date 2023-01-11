import inquirer from "inquirer";
import db from "sequilize";

db.connect(err => {
    if (err) throw err;
    console.log("Database Connected");
    employee_tracker();
});

const employee_tracker = function () {
    inquirer.prompt([{
        // Begin Command Line
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Department', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }]).then((answers) => {});
}
