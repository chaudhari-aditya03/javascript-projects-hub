class Employee {
  work() {
    console.log("Employee is working");
  }
}
class Teacher extends Employee {
  work() {
    console.log("Teacher is teaching students 📚");
  }
}

class Manager extends Employee {
  work() {
    console.log("Manager is managing the team 👔");
  }
}
class Developer extends Employee {
  work() {
    console.log("Developer is writing code 💻");
  }
}
let e1 = new Employee();
let t1 = new Teacher();
let m1 = new Manager();

e1.work();
t1.work();
m1.work();



let d1 = new Developer();
d1.work();
