function addItem() {
    let list = document.getElementById('todolist');
    let todo = document.getElementById('item');
    let listitem = document.createElement('li');
    let xbtn = document.createElement('button');
    let checkbox = document.createElement('input');
    let wrapper = document.createElement('div');

    listitem.className = 'list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center';
    xbtn.className = 'close';
    xbtn.innerHTML = '&times;';

    xbtn.onclick = function(e) {
        let pnode = e.target.parentNode;
        list.removeChild(pnode);
    }

    checkbox.type = 'checkbox';
    checkbox.className = 'mr-3';
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            listitem.style.textDecoration = 'line-through';
        } else {
            listitem.style.textDecoration = 'none';
        }
    });

    wrapper.className = 'd-flex align-items-center';
    wrapper.appendChild(checkbox);
    wrapper.appendChild(document.createTextNode(todo.value));
    listitem.appendChild(wrapper);
    listitem.appendChild(xbtn);
    list.appendChild(listitem);

    saveToDatabase(todo.value); // 서버로 데이터 전송

    todo.value = '';
    todo.focus();
}

function saveToDatabase(todoContent) {
    fetch('/addTodo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: todoContent })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
