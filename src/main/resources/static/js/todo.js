$(document).ready(function () {
    function loadTodos(pageNumber = 1) {
        $.ajax({
            url: '/mypage/list',
            type: 'GET',
            data: { page: pageNumber, pageSize: 6 },
            success: function(response) {
                if (response.success) {
                    setupPagination(response.totalItems, response.todoList);
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

    function setupPagination(totalItems, todoList) {
        $('#pagination-mini').pagination({
            dataSource: todoList,
            pageSize: 6,
            callback: function(data, pagination) {
                var todoContainer = $('#todolist');
                todoContainer.empty();
                data.forEach(function(todo) {
                    var listItem = `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <input type="hidden" class="todo-id" name="todoId" value="${todo.todoId}">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input todo-checkbox" ${todo.completed ? 'checked' : ''}>
                                <span class="todo-txt ${todo.completed ? 'text-decoration-line-through' : ''}">${todo.content}</span>
                            </div>
                            <div class="btn-group-todo">
                                <button id="edit-btn" class="edit-btn btn" style="${todo.completed ? 'display:none;' : ''}" data-todo-id="${todo.todoId}">수정</button>
                                <button id="delete-btn" class="delete-btn btn" style="${!todo.completed ? 'display:none;' : ''}" data-todo-id="${todo.todoId}">삭제</button>
                            </div>
                        </li>`;
                    todoContainer.append(listItem);
                });
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

        const employeeCode = $('meta[name="employeeCode"]').attr('content');
        console.log(employeeCode);
        console.log(typeof employeeCode);

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
                    alert('할 일이 추가되었습니다.');
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
        var todoId = $(this).data('todo-id');

        $.ajax({
            url: '/mypage/delete',
            type: 'POST',
            data: { todoId: todoId },
            success: function(data) {
                if (data.success) {
                    alert('할 일이 삭제되었습니다.');
                    loadTodos();
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
                        alert('할 일이 수정되었습니다.');
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
});
