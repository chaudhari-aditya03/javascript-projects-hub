let names =[
    {name : "Alice",age:25},
    {name : "Bob",age:30},
    {name : "Charlie",age:35}   
];
console.log(names.map(n => n.name));
console.log(names.filter(n => n.name === "Bob"));