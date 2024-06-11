
function submitLogout() {
    fetch('/user/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: ''
    })
        .then(response => {
            if (response.ok) {
                alert('로그아웃 성공');
                window.location.href = '/loginPage';
            } else if (response.status === 401) { // Unauthorized status
                alert('로그인 해주세요');
                window.location.href = '/loginPage'; // Redirect to login page
            } else {
                alert('로그아웃 실패');
            }
        })
        .catch(error => console.error('Error:', error));
}
