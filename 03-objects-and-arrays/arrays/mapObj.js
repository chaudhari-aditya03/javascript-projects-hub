let Student=[
    {
    name:"Aditya Chaudhari",
    age: 22,
    course: "MERN Stack",
    },
    {
    name:"Rahul Chaudhari",
    age: 25,
    course: "MERN Stack",
    },
    {
    name:"Satyarth Chaudhari",
    age: 20,
    course: "MERN Stack",
    }
];
const studentNames = Student.map((student)=>{
    return student.age;
});

const f1 = Student.filter((age)=>{
    if(age>21) return console.log(age.name);
});
console.log(f1);