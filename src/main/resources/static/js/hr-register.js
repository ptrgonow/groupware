document.addEventListener('DOMContentLoaded', function () {
    const departmentSelect = document.getElementById('department');

    // 부서 정보를 가져와서 옵션 태그에 추가
    fetch('/user/dept')
        .then(response => response.json())
        .then(data => {
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.departmentId;
                option.textContent = department.departmentName;
                departmentSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching departments:', error));
});
