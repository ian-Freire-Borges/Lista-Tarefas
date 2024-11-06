const allForm = document.querySelector("#all-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const favBtn = document.querySelectorAll(".fav-btn")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-button")
const filterBtn = document.querySelector("#filter-select")
let oldInputValue;
// funçoes
const saveTodo = (text, done = 0,save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const favBtn = document.createElement("button")
    favBtn.classList.add("fav-btn")
    favBtn.innerHTML = '<i class="fas fa-heart"></i>'
    todo.appendChild(favBtn);

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button")
    removeBtn.classList.add("remove-todo")
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(removeBtn);

    //utilizando dados da local store
    if(done){
        todo.classList.add("done")
    }

    if(save){
        saveTodoLocalStorage({text , done,favv:false})
    }
    todoList.appendChild(todo);

    todoInput.value ="";
    todoInput.focus();
};

const toggleForms = ()=>{
    editForm.classList.toggle("hide");
    allForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

const updateTodo = (text) =>{
    
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) =>{

        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text;

            updateTodosLocalStore(oldInputValue,text);
        }

    });
};

const getSearchtodo = (search) => {

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) =>{

        let todoTitle = todo.querySelector("h3").innerText.toLocaleLowerCase();

        const normaLizedSearch = search.toLowerCase();

        todo.style.display = "flex";

        if(!todoTitle.startsWith(normaLizedSearch)){
            todo.style.display = "none";
        }

    });

};

const filterTodos=(filterValue)=>{


    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) =>{
        
        todo.style.display = "flex";
        if (filterValue === "all") {
            return; 
        };
        if(filterValue === "todo"){
            if(todo.className.includes("done") ){
                todo.style.display = "none";
            }
        }
         else if(!todo.className.includes(filterValue)) {
            todo.style.display = "none";
        };
    });
};
// eventos
allForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
    }
})

document.addEventListener("click", (e)=>{
    const targertEl = e.target;
    const parentEl = targertEl.closest("div");
    let todoTittle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTittle = parentEl.querySelector("h3").innerText
    }

    if(targertEl.classList.contains("fav-btn")){
        targertEl.classList.toggle("fav")
        parentEl.classList.toggle("favv")
        updateTodosStatusLocalStorefavv(todoTittle);
    }

    if(targertEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done")
        updateTodosStatusLocalStore(todoTittle);
    }

    if(targertEl.classList.contains("remove-todo")){
        parentEl.remove();

        removeTodoLocalStorage(todoTittle);
    }

    if(targertEl.classList.contains("edit-todo")){
        toggleForms();


        editInput.value = todoTittle;
        oldInputValue = todoTittle
    }
})

cancelEditBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    toggleForms();
})

editForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue){
        updateTodo(editInputValue)
    }

    toggleForms();
})

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value

    getSearchtodo(search);
})

eraseBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    searchInput.value="";
    searchInput.dispatchEvent(new Event("keyup"));
})

filterBtn.addEventListener("change",(e)=>{
    const filterValue = e.target.value;

    filterTodos(filterValue);
})

// local store
const getTodosLocalStorage = () =>{
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const loadTodos = () =>{
    const  todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
        const todoDiv = todoList.lastElementChild;
        const favBtn = todoDiv.querySelector('.fav-btn');
        if (todo.favv) {
            todoDiv.classList.add('favv'); 
            favBtn.classList.add('fav');   
        }
    });
};
const saveTodoLocalStorage = (todo) => {
   const todos = getTodosLocalStorage();
    
   todos.push(todo)

    localStorage.setItem("todos",JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos",JSON.stringify(filteredTodos));

}

const updateTodosStatusLocalStore = (todoText) =>{

    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoText ? todo.done = !todo.done : null);

    localStorage.setItem("todos",JSON.stringify(todos));

}

const updateTodosStatusLocalStorefavv = (todoText) =>{

    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoText ? todo.favv = !todo.favv : null);

    localStorage.setItem("todos",JSON.stringify(todos));

}

const updateTodosLocalStore = (todoOldText,todoNewText) =>{

    const todos = getTodosLocalStorage();

    todos.map((todo) => 
        todo.text === todoOldText ? (todo.text = todoNewText): null);

    localStorage.setItem("todos",JSON.stringify(todos));

}

loadTodos();