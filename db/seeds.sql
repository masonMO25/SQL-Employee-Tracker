-- Inserts names of departments into department table
INSERT INTO department
  (name)
VALUES
  ('Engineering'),
  ('Sales'),
  ('Finance'),
  ('Legal');

-- Inserts roles of employee into role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Software Engineer', 70000, 1),
  ('Salesperson', 70000, 2),
  ('Accountant', 100000, 3),
  ('Lawyer', 150000, 4);

-- Inserts employee information into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Mickey', 'Mouse', 1, 3),
  ('James', 'CAmeron', 2, 4),
  ('Joe', 'Mama', 3, 5),
  ('Molly', 'Morgan', 4, 1);