$(document).ready(function () {
    $('#todo_form').on('submit', function (event) {
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

    $('#todolist').on('change', '.todo-checkbox', function() {
        $(this).parent().toggleClass('completed');
        toggleDeleteBtn();
    });

    $('#todolist').on('click', '.delete-btn', function() {
        $(this).parent().remove();
        toggleDeleteBtn();
    });

    function addTodoItem(content) {
        const li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center').append(
            $('<input>').attr('type', 'checkbox').addClass('form-check-input todo-checkbox'),
            $('<span>').text(content),
            $('<button>').addClass('btn btn-danger delete-btn').text('삭제')
        );
        $('#todolist').append(li);
    }

    function toggleDeleteBtn() {
        const allChecked = $('.todo-checkbox:checked').length > 0;
        $('.delete-btn').prop('disabled', !allChecked);
    }
});
