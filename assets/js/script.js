var formEl = document.querySelector("#task-form"); //<form>
var taskToDoEl = document.querySelector("#task-to-do"); //<ul>
var taskInProgressEl = document.querySelector("#task-in-progress"); //<ul>
var taskCompletedEl = document.querySelector("#task-completed"); //<ul>
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;

 var taskFormHandler = function(){
    window.event.preventDefault();
    var taskNameInput = document.querySelector("input[name = 'task-name']").value;
    var taskTypeInput = document.querySelector("select[name = 'task-type']").value;
    
    //check if input values are empty strings
    if(!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }

    //erases form data after submitting
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
    //is the task in edit mode, or new task mode?
    if(isEdit){
        //has data attribute, so get task id and call function to complete edit process
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        //package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };
        //send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
};

var completeEditTask = function(taskName, taskType, taskId){
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("task updated");

    //reset the form by removing the task id
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var createTaskEl = function(taskdataObj){
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskdataObj.name + "</h3><span class='task-type'>" + taskdataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    //creates the task
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    taskToDoEl.appendChild(listItemEl);

    //add entire list item to list
    taskToDoEl.appendChild(listItemEl);

    // increase the counter
    taskIdCounter++;
};

var createTaskActions = function(taskId){
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    //create status button
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);

    //create status options
    var statusChoices = ["To do", "In Progress", "Completed"];
    for(var i=0; i<statusChoices.length; i++){
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var deleteTask = function(taskId){
    //selects the list with a class of .task-item and data-task-id of taskId and assigns it to a variable
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove();
};

var editTask = function(taskId){
    console.log("editing task #" + taskId);

    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    //fills the form boxes using the aquired data
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    //update the submit button
    document.querySelector("#save-task").textContent = "Save Task";
    //sets the form's data-task-id to taskId
    formEl.setAttribute("data-task-id", taskId);
}

var taskButtonHandler = function(event){
    //get button from event
    var targetEl = window.event.target;

    //edit button was clicked
    if(targetEl.matches(".edit-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    //delete if button was clicked
    } else if(window.event.target.matches(".delete-btn")){
        //get the element's id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event){
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //if the value that was seleted matches, move it to that parent
    if (statusValue === "to do") {
        taskToDoEl.appendChild(taskSelected);
      } 
      else if (statusValue === "in progress") {
        taskInProgressEl.appendChild(taskSelected);
      } 
      else if (statusValue === "completed") {
        taskCompletedEl.appendChild(taskSelected);
      }
}


//looks out for if the edit or delete buttons were clicked
pageContentEl.addEventListener("click", taskButtonHandler);
//looks out for if the status has changed
pageContentEl.addEventListener("change", taskStatusChangeHandler);