
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
                window.location.href = '/';
            } else {
                alert('로그아웃 실패');
            }
        })
        .catch(error => console.error('Error:', error));
}
