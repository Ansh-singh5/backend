<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Document</title>

</head>

<body>

<button id="btn">click</button>

<input id="contain" type="text" placeholder="type"></input>

<script>

const btn=document.getElementById("btn");

const container=document.getElementById("contain");

btn.addEventListener("click",(e)=>{

if(container.value===""){

console.log.out("type bruhh");

}

})

</script>

</body>

</html>
