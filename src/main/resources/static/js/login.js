
$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 방지

        const formData = $(this).serialize(); // 폼 데이터를 직렬화

        $.ajax({
            url: '/user/login',
            method: 'POST',
            data: formData,
            success: function(response) {
                alert(response.message);
                if (response.message === "로그인 성공") {
                    // 로그인 성공 시 원하는 페이지로 리디렉션
                    window.location.href = '/'; // 리디렉션할 URL 설정
                }
            },
            error: function(error) {
                alert('로그인 실패: ' + error.responseJSON.message);
                window.location.reload(); // 실패 시 페이지 새로고침
            }
        });
    });

    // 엔터 키로 폼이 제출되는 것을 방지
    $('#loginForm input').on('keypress', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#loginForm').submit();
        }
    });
});
