// Write a JavaScript function to extract unique characters from a string.
// Example: str = “abcdabcdefgggh”
// ans = “abcdefgh
let str = "abcdabcdefgggh";

const fun =(str)=>{
    let res ="";
    for(let i =0;i<str.length;i++)
    {
        if(!res.includes(str[i]))
        {
            res+=str[i];
        }
    }
    return res;
}
console.log(fun(str));