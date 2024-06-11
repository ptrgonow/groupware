

function submitLoginForm() {
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    fetch('/user/login', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === '로그인 성공') {
                window.location.href = '/';
            } else {
                alert('로그인 실패');
            }
        })
        .catch(error => console.error('Error:', error));
}

