$(document).ready(function () {
    function loadTodos() {
        $.ajax({
            url: '/mypage/list',
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    var todoList = response.todoList;
                    var todoContainer = $('#todolist');
                    todoContainer.empty();
                    todoList.forEach(function(todo) {
                        var listItem = `
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <input type="checkbox" class="form-check-input todo-checkbox">
                                <input type="hidden" class="todo-id" name="todoId" value="${todo.todoId}">
                                <span>${todo.content}</span>
                                <button class="btn btn-danger delete-btn" data-todo-id="${todo.todoId}">삭제</button>
                            </li>`;
                        todoContainer.append(listItem);
                    });
                } else {
                    alert(response.message);
                    window.location.href = '/loginPage';
                }
            },
            error: function() {
                alert('서버와 통신 중 오류가 발생했습니다.');
            }
        });
    }

    loadTodos();

    $('#form-group').on('submit', function (event) {
        event.preventDefault();

        const content = $('#todo').val().trim();
        if (content === '') {
            alert('할 일을 입력하세요.');
            return;
        }

        const employeeCode = $('input[name="employeeCode"]').val();

        const requestData = {
            content: content,
            employeeCode: employeeCode
        };

        $.ajax({
            url: '/mypage/add',
            type: 'POST',
            data: requestData,
            success: function (data) {
                if (data.success) {
                    addTodoItem(content);
                    $('#todo').val('');
                    loadTodos();
                } else {
                    alert('할 일을 추가하는데 실패했습니다.');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert('할 일을 추가하는데 실패했습니다.');
            }
        });
    });

    $('#todolist').on('click', '.delete-btn', function() {
        var todoId = $(this).data('todo-id'); // 삭제 버튼의 데이터 속성에서 todoId 값을 가져옴

        $.ajax({
            url: '/mypage/delete',
            type: 'POST',
            data: { todoId: todoId },
            success: function(data) {
                if (data.success) {
                    $('input[name="todoId"][value="' + todoId + '"]').parent().remove();
                } else {
                    alert('할 일을 삭제하는데 실패했습니다.');
                }
            },
            error: function() {
                alert('서버와 통신 중 오류가 발생했습니다.');
            }
        });
    });

    function addTodoItem(content) {
        const li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center').append(
            $('<input>').attr('type', 'checkbox').addClass('form-check-input todo-checkbox'),
            $('<span>').text(content),
            $('<button>').addClass('btn btn-danger delete-btn').text('삭제')
        );
        $('#todolist').append(li);
    }
});
