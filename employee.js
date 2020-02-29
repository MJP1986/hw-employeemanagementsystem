const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "kproot012",
  database: "employeeTracker"
});

connection.connect(function(err) {
  if (err) throw err;
  employeeStart();
});

function employeeStart() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add departments",
        "Add roles",
        "Add employees",
        "View department",
        "View roles",
        "View employees",
        "Update employee role"
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case "Add departments":
          addDepartment();
          break;

        case "Add roles":
          addRoles();
          break;

        case "Add employees":
          addEmployee();
          break;

        case "View department":
          viewDepartment();
          break;

        case "View roles":
          viewRoles();
          break;

        case "View employees":
          viewEmployee();
          break;

        case "Update employee role":
          updateEmployee();
          break;
      }
    });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the department name you would like to add?"
    })
    .then(answer => {
      connection.query(
        "INSERT INTO department (name) VALUE (?)",
        answer.department,
        (err, res) => {
          if (err) throw err;
          console.log("sucess");
          employeeStart();
        }
      );
    });
}

function addRoles() {
  connection.query("SELECT * FROM department", (err, res) => {
    let departmentChoice = res.map(department => {
      return { name: department.name, value: department.id };
    });
    inquirer
      .prompt([
        {
          name: "departmentid",
          type: "list",
          message: "Which department would you like to add this role to?",
          choices: departmentChoice
        },
        {
          name: "rolename",
          type: "input",
          message: "What is the role name you would like to add?"
        },
        {
          name: "rolesalary",
          type: "number",
          message: "What is the role salary?"
        }
      ])
      .then(answer => {
        console.log(answer);
        connection.query(
          "INSERT INTO role (title, salary, departmentID) VALUE (?, ?, ?)",
          [answer.rolename, answer.rolesalary, answer.departmentid],
          (err, res) => {
            if (err) throw err;
            console.log("sucess");
            employeeStart();
          }
        );
      });
  });
}

function addEmployee() {
  connection.query("SELECT * FROM role", (err, res) => {
    let rolelist = res.map(role => {
      return { name: role.title, value: role.id };
    });
    connection.query("SELECT * FROM employee", (err, res) => {
      let managerlist = res.map(manager => {
        return {
          name: manager.first_name + " " + manager.last_name,
          value: manager.id
        };
      });
      console.log("asdsddd");
      console.log(rolelist);
      inquirer
        .prompt([
          {
            name: "firstname",
            type: "input",
            message: "What is your first name"
          },
          {
            name: "lastname",
            type: "input",
            message: "What is your last name?"
          },
          {
            name: "roleid",
            type: "list",
            message: "What is your role id?",
            choices: rolelist
          },
          {
            name: "managerid",
            type: "list",
            message: "What is your manager id?",
            choices: managerlist
          }
        ])
        .then(answer => {
          connection.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)",
            [
              answer.firstname,
              answer.lastname,
              answer.roleid,
              answer.managerid
            ],
            (err, res) => {
              if (err) throw err;
              console.log("sucess");
              employeeStart();
            }
          );
        });
    });
  });
}

function viewDepartment() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    let departArray = res.map(department => {
      return { id: department.id, name: department.name };
    });
    console.log(departArray);
    employeeStart();
  });
}

function viewRoles() {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    let roleArray = res.map(role => {
      return { title: role.title, salary: role.salary };
    });
    console.log(roleArray);
    employeeStart();
  });
}

function viewEmployee() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.log(res);
    let empArray = res.map(employee => {
      return {
        firstname: employee.first_name,
        lastname: employee.last_name,
        roleid: employee.role_id,
        managerid: employee.manager_id
      };
    });
    console.log(empArray);
    employeeStart();
  });
}

function updateEmployee() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    let employeeList = res.map(employee => {
      return { name: employee.first_name, value: employee.id };
    });
    connection.query("SELECT * FROM role", (err, res) => {
      let rolelist = res.map(role => {
        return { name: role.title, value: role.id };
      });
      console.log(employeeList);
      console.log(rolelist);
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee would you like to update a role for?",
            choices: employeeList
          },
          {
            name: "role",
            type: "list",
            message: "Which role would you like to pick?",
            choices: rolelist
          }
        ])
        .then(answer => {
          connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [answer.role, answer.employee],
            err => {
              if (err) throw err;
              employeeStart();
            }
          );
        });
    });
  });
}
