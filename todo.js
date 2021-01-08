const todoaddForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo");
const todoList = document.querySelector(".list-group");

// eklendi eklenmedi uyarı vermek için carbody
const firstCardbody = document.querySelectorAll(".card-body")[0];
const secondCardbody = document.querySelectorAll(".card-body")[1];


// arama
const filter = document.querySelector("#filter");

// butonlar
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){
    todoaddForm.addEventListener("submit",addTodo);
    // sayfa yenilendiğinde direkt olarak bu çalışacak
    document.addEventListener("DOMContentLoaded",loadAllTodosToHTML);
    // silme işlemi
    secondCardbody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);

}





// Todoları arayüzden silme 
function deleteTodo(e){
    // cardbodynin içinde x işaretine tıklanırsa o todoyu silicez
    if(e.target.className === "fa fa-remove"){
        // i parentı a, 
        // a parentı li
        // 2 üst çıkarak li'ye ulaşıyoruz ve o li'yi silmemiz lazım
        e.target.parentElement.parentElement.remove();
        // texti alıyoruz ve storagedan silmek için gönderiyoruz
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent)
        showAlert("warning", "Başarıyla Silindi.");
    }
}





// textContenti alıp göndermemiz lazım
function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo === deletetodo){
            // array splice ve forEach index bilmeliyiz
            todos.splice(index,1);
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));

}





function loadAllTodosToHTML(){
    // localStorage'dan todoları aldık
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){
        // html'ini oluşturup ekleme fonksiyonumuz zaten mevcuttu.
        createTodoToHTML(todo);
    });
}





function addTodo(e){
    /* string trim - boşlukları siliyoruz*/
    const newTodo = todoInput.value.trim();
    

    // input alanı kontrol - uyarılar
    if(newTodo === ""){

        // alert type ( success,danger,warning..) ve message gönderilecek
        showAlert("danger","Lütfen bir todo giriniz.");
    }else {
        createTodoToHTML(newTodo);
        addTodoStorage(newTodo);
        showAlert("success","Todo Başarıyla eklendi.");
    }


    e.preventDefault();
}





function showAlert(type,message){
    /*
    <div class="alert alert-danger" role="alert">
        This is a danger alert—check it out!
    </div>
    */
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;
    alert.setAttribute("role","alert");
    alert.textContent = message;
    
    firstCardbody.appendChild(alert);

    // belli bir saniye sonra uyarıyı kaldırma
    setTimeout(function(){
        alert.remove();
    },2000);


}





// localStorage'dan todoları alıyor yoksa boş array oluşturuyor
function getTodosFromStorage(){
    let todos;

    if(localStorage.getItem("todos") === null){
        todos = [];
    }else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    return todos;
}
function addTodoStorage(newTodo){
    let todos = getTodosFromStorage();
    todos.push(newTodo);

    // localStorage güncelliyoruz
    localStorage.setItem("todos",JSON.stringify(todos));
}





// HTML sayfasına list item olarak ekleme
function createTodoToHTML(newTodo){
   
    // List Oluşturma - li
    const listItem = document.createElement("li");
    // Link Oluşturma - a
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";
    
    
    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo));
    // a etiketini li'ye ekleme
    listItem.appendChild(link);
    

    // todoList'e listItem'ı ekleme
    todoList.appendChild(listItem);


    // ekleme işleminden sonra input alanını boş string yapıyoruz
    todoInput.value = "";
    

}





function filterTodos(e){
    // girilen değeri küçük harfe çeviriyoruz
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        // li içeriklerini alıyoruz küçük harfe çeviriyoruz
        const text = listItem.textContent.toLowerCase();

        if(text.indexOf(filterValue) === -1){
            // bulamadı
            listItem.setAttribute("style","display:none !important");

        }else {
            listItem.setAttribute("style","display:block");
        }
    });
}





function clearAllTodos(e){
    // Arayüzden todoları temizleme
    if(confirm("Bütün todoları sileceksiniz.Devam edilsin mi?")){
        // yöntem 1 = yavaş versiyon
        // todoList.innerHTML = "";
        // yöntem 2 = hızlı versiyon
        // dönen değer null değilse devam et 
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }


        // localStorage'dan silme
        localStorage.removeItem("todos");
        
       
    }
}