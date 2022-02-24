var formEl = document.querySelector("#task-form"); //<form>
var taskToDoEl = document.querySelector("#task-to-do"); //<ul>
var taskInProgressEl = document.querySelector("#task-in-progress"); //<ul>
var taskCompletedEl = document.querySelector("#task-completed"); //<ul>
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var tasks = [];

//handles how the form submits data
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
            type: taskTypeInput,
            status: "to do"
        };
        //send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
};

//takes the newly edited task info and applies it
var completeEditTask = function(taskName, taskType, taskId){
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    //update the object in the array with the new values
    for(var i=0; i<tasks,length; i++){
        //convert taskId form string to a number and then make the comparison
        if(tasks[i].id === parseInt(taskId)){
            task[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    //then save to local storage
    saveTasks();

    alert("task updated");

    //reset the form by removing the task id
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

//creates a new task and puts it in the 'to-do' div
var createTaskEl = function(taskDataObj){
    //create list item element
    var listItemEl = document.createElement("li");
    //add a class & a custom attribute to the list element 
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    //create div to hold the list & add a class name
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    //append the div to the list
    listItemEl.appendChild(taskInfoEl);

    //creates the edit, delete, and status buttons & applies it to a variable
    var taskActionsEl = createTaskActions(taskIdCounter);
    //append the task actions to the list
    listItemEl.appendChild(taskActionsEl);
    //append the list to the task to do container
    taskToDoEl.appendChild(listItemEl);

    //add the task id to the object
    taskDataObj.id = taskIdCounter;
    //and then push it to the end of the tasks array
    tasks.push(taskDataObj);
    //then save to local storage
    saveTasks();

    // increase the counter
    taskIdCounter++;
};

//generates the edit, delete, and change tasks buttons
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


//deletes a task
var deleteTask = function(taskId){
    //selects the list with a class of .task-item and data-task-id of taskId and assigns it to a variable
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for(var i=0; i<tasks.length; i++){
        //if tasks[i].id doesnt match the value of taskId, lets keep that task & push it into the new array
        if(tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks attay to be the same as updatedTaksArr
    tasks = updatedTaskArr;
    //then save to local storage
    saveTasks();
};

//sets up the form to allow editing of task
var editTask = function(taskId){
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

//handles if the edit or delete button were clicked, adn runs the coresponding functions
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

//handles the changing of the status of tasks
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

    //update the array with the newly changed status
    for(var i=0; i<tasks.length; i++){
        //convert the task id into an int, then compare
        if(tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }
    //then save to local storage
    saveTasks();
};

//saves the newly updated array to local Sotrage
var saveTasks = function(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

//loads the tasks array
var loadTasks = function(){
    //retreive tasks from localStorage
    tasks = localStorage.getItem("tasks");
    //check if the tasks array is null
    if(!tasks){
        tasks = []
        //ends the function since we dont want anything returning to the page
        return false;
    }
    //if not null, convert the string back into a proper array
    tasks = JSON.parse(tasks);

    //now, using a for loop, print the array using DOM methods
    for(var i=0; i<tasks.length; i++){
        //generate variables
        tasks[i].id = taskIdCounter;
        var listItemEl = document.createElement("li");
        var taskInfoEl = document.createElement("div");
        //fill the list info
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", taskIdCounter);
        //fill the div info
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        //append the div to the list
        listItemEl.appendChild(taskInfoEl);
        //generate the edit, delete, and chang ebuttons and attatch it to the variable
        var taskActionsEl = createTaskActions(tasks[i].id);
        //then append to the list
        listItemEl.appendChild(taskActionsEl);

        //if the status matches, then change the  item on the drop down list to the 0'th index
        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            //lastly, append to the parent container
            taskToDoEl.appendChild(listItemEl);
          } 
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            taskInProgressEl.appendChild(listItemEl);
          } 
        else if (tasks[i].status === "completed") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            taskCompletedEl.appendChild(listItemEl);
          }
        //increment the taskIdCounter
        taskIdCounter++;

        console.log(listItemEl);
    }

};

loadTasks();
//looks out for a submit in the form element
formEl.addEventListener("submit", taskFormHandler);
//looks out for if the edit or delete buttons were clicked
pageContentEl.addEventListener("click", taskButtonHandler);
//looks out for if the status has changed
pageContentEl.addEventListener("change", taskStatusChangeHandler);