const fs=require('fs');
const path=require('path');

const todoFile=path.join(__dirname,'todo.json');

console.log(todoFile);

function ReadTodos(){
    const data=fs.readFileSync(todoFile,'utf-8');
    return JSON.parse(data);
}

function WriteTodos(todos){
    fs.writeFileSync(todoFile,JSON.stringify(todos,null,2));
}

function AddTodo(task){
    const todos=ReadTodos();
    const newTodo={id:Date.now(),task,completed:false};
    todos.push(newTodo);
    WriteTodos(todos);
    return newTodo;
}

AddTodo('Learn Node.js');
AddTodo('Build a TODO app');
