var buttonE1 = document.querySelector("#save-task"); //<button>
var taskToDoEl = document.querySelector("#task-to-do"); //<ul>

 var createTaskHandler = function(){
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task";
    taskToDoEl.appendChild(listItemEl);
};

buttonE1.addEventListener("click", createTaskHandler );
