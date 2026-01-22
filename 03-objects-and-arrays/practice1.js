class Employee {
  constructor(id, name, salary) {
    this.id = id;
    this.name = name;
    this.salary = salary;
  }

  getDetails() {
    console.log(
      `ID: ${this.id}, Name: ${this.name}, Salary: ₹${this.salary}`
    );
  }
}
class Teacher extends Employee {
  constructor(id, name, salary, subjectTaught) {
    super(id, name, salary);
    this.subjectTaught = subjectTaught;
  }

  teach() {
    console.log(this.name + " teaches " + this.subjectTaught);
  }
}
class Administrator extends Employee {
  constructor(id, name, salary, department) {
    super(id, name, salary);
    this.department = department;
  }

  manage() {
    console.log(this.name + " manages " + this.department + " department");
  }
}
class SupportStaff extends Employee {
  constructor(id, name, salary, duty) {
    super(id, name, salary);
    this.duty = duty;
  }

  assist() {
    console.log(this.name + " handles " + this.duty);
  }
}
let teacher1 = new Teacher(101, "Aditya", 45000, "Java");
let admin1 = new Administrator(201, "Ram", 60000, "Admissions");
let staff1 = new SupportStaff(301, "Utkarsh", 25000, "Maintenance");

teacher1.getDetails();
teacher1.teach();

admin1.getDetails();
admin1.manage();

staff1.getDetails();
staff1.assist();
