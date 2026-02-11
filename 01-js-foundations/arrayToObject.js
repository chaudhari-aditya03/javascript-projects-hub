let arr = [1,2,3,1,2,5,1,4,7];
let a1 =[];
let j =0;
let uniqueArray = (arr)=>{
    for(let i=0;i<arr.length;i++)
        {
            if(a1.includes(arr[i]) === false){
                a1[j] = arr[i];
                j++;
            }
        }
        console.log(a1);
    }
console.log(uniqueArray(arr));

let count = (arr)=>{
    for(let i=0;i<arr.length;i++)
        {
           
        }
    }
    console.log(count(arr));
