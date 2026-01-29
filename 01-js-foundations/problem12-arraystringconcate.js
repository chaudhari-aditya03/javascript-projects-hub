let arr =["Hi!",",","I am Aditya. ",",","I am From Sangamner"];

function concat(arr){
    let res ="";
    for(let i in arr)
    {
        res+=arr[i];
    }
    return res;
}
console.log(concat(arr));