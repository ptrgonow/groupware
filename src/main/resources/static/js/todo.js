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
                                <input type="hidden" class="todo-id" name="todoId" value="${todo.todoId}">
                                <div class="d-flex align-items-center">
                                    <input type="checkbox" class="form-check-input todo-checkbox" ${todo.completed ? 'checked' : ''}>
                                    <span class="todo-txt ${todo.completed ? 'text-decoration-line-through' : ''}">${todo.content}</span>
                                </div>
                                <div class="btn-group">
                                    <button id="edit-btn" class="edit-btn btn" ${todo.completed ? 'style="display:none;"' : ''} data-todo-id="${todo.todoId}">수정</button>
                                    <button id="delete-btn" class="delete-btn btn" ${!todo.completed ? 'style="display:none;"' : ''} data-todo-id="${todo.todoId}">삭제</button>
                                </div>
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
                    addTodoItem(data.todo);
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
                    loadTodos(); // 리스트를 다시 불러와서 최신 상태로 유지
                } else {
                    alert('할 일을 삭제하는데 실패했습니다.');
                }
            },
            error: function() {
                alert('서버와 통신 중 오류가 발생했습니다.');
            }
        });
    });

    $('#todolist').on('click', '.edit-btn', function() {
        var todoId = $(this).data('todo-id');
        var newContent = prompt('수정할 내용을 입력하세요:');
        if (newContent) {
            $.ajax({
                url: '/mypage/update',
                type: 'POST',
                data: { todoId: todoId, content: newContent },
                success: function(data) {
                    if (data.success) {
                        loadTodos();
                    } else {
                        alert('할 일을 수정하는데 실패했습니다.');
                    }
                },
                error: function() {
                    alert('서버와 통신 중 오류가 발생했습니다.');
                }
            });
        }
    });

    $('#todolist').on('change', '.todo-checkbox', function() {
        var listItem = $(this).closest('.list-group-item');
        var todoId = listItem.find('.todo-id').val();
        var isChecked = $(this).is(':checked');

        if (isChecked) {
            listItem.find('.todo-txt').addClass('text-decoration-line-through');
            listItem.find('.edit-btn').hide();
            listItem.find('.delete-btn').show();
        } else {
            listItem.find('.todo-txt').removeClass('text-decoration-line-through');
            listItem.find('.edit-btn').show();
            listItem.find('.delete-btn').hide();
        }

        $.ajax({
            url: '/mypage/updateStatus',
            type: 'POST',
            data: { todoId: todoId, completed: isChecked },
            success: function(data) {
                if (!data.success) {
                    alert('할 일 상태를 업데이트하는데 실패했습니다.');
                    loadTodos();
                }
            },
            error: function() {
                alert('서버와 통신 중 오류가 발생했습니다.');
                loadTodos();
            }
        });
    });

    function addTodoItem(todo) {
        const li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center').append(
            $('<input>').attr('type', 'hidden').addClass('todo-id').attr('name', 'todoId').val(todo.todoId),
            $('<div>').addClass('d-flex align-items-center').append(
                $('<input>').attr('type', 'checkbox').addClass('form-check-input todo-checkbox').prop('checked', todo.completed),
                $('<span>').text(todo.content).addClass('todo-txt').toggleClass('text-decoration-line-through', todo.completed)
            ),
            $('<div>').addClass('btn-group').append(
                $('<button>').addClass('edit-btn btn').text('수정').attr('data-todo-id', todo.todoId).toggle(!todo.completed),
                $('<button>').addClass('delete-btn btn').text('삭제').attr('data-todo-id', todo.todoId).toggle(todo.completed)
            )
        );
        $('#todolist').append(li);
    }
});
