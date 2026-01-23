let arr =[['X',"_",'O'],["_",'X',"_"],['O',"_",'X']]
for(let i = 0;i<arr.length;i++)
{
    for(let j=0 ;j<arr.length;j++)
    {
          process.stdout.write(arr[i][j] + " ");
    }
    console.log();
}