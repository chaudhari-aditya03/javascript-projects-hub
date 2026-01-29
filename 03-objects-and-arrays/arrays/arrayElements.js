//Qs1. Write a JavaScript function that returns array elements larger than a number.
let arr =[10,20,80,40,50,62,50,35,84,59];
let num = 50;

const largetElement = (arr,num)=>{
    for(let i =0;i<arr.length;i++)
    {
        if(arr[i]>num){
            console.log(arr[i]);
        }
    }
    return;
}
largetElement(arr,num);