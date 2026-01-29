// Write a JavaScript function to generate a random number within a range (start,
// end)
let num = 20; 
let list =[];
const random =(num)=>
{   for(let i =0;i<10;i++){
    number = Math.floor(Math.random()*num)+1;
    list[i] =number;
}
}
random(num);
console.log(list);