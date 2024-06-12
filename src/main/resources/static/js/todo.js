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
            data: requestData, // 데이터를 URL 인코딩 방식으로 보냄
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

    function addTodoItem(content) {
        const li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center').text(content);
        $('#todolist').append(li);
    }
});
