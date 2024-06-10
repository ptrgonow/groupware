
document.addEventListener('DOMContentLoaded', function() {
    const employeeCode = 'EMP001'; // 여기서 employee_code를 설정합니다.
    fetch(`/user/info?employee_code=${employeeCode}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.name) {
                document.getElementById('username').textContent = data.name;
            }
        })
        .catch(error => console.error('Error fetching user info:', error));
});
