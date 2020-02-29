DROP DATABASE IF EXISTS employeeTracker;
CREATE database employeeTracker;

USE employeeTracker;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10.2) NULL,
    departmentID INT,
    PRIMARY KEY (id),
    FOREIGN KEY (departmentID) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES  employee(id),
    PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUE ("PARK");

INSERT INTO role (title, salary)
VALUE ("Full Stack Developer", 90000.50);

INSERT INTO department (first_name, last_name, role_id, manager_id)
VALUE ("MinJin", "Park", 1, 1);