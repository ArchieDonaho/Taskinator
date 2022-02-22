var formEl = document.querySelector("#task-form"); //<form>
var taskToDoEl = document.querySelector("#task-to-do"); //<ul>

 var taskFormHandler = function(){
    window.event.preventDefault();
    var taskNameinput = document.querySelector("input[name = 'task-name']").value;
    var taskTypeInput = document.querySelector("select[name = 'task-type']").value;
    
    //package up data as an object
    var taskDataObj = {
        name: taskNameinput,
        type: taskTypeInput
    };

    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj);   
};

var createTaskEl = function(taskdataObj){
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskdataObj.name + "</h3><span class='task-type'>" + taskdataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    //add entire list item to list
    taskToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", taskFormHandler);