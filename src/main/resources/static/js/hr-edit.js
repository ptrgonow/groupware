document.addEventListener('DOMContentLoaded', function() {
    // 테이블의 데이터를 JavaScript 배열로 가져오기
    var employees = [];
    document.querySelectorAll('#employeeTableBody tr').forEach(function(row) {
        var employee = {
            employeeCode: row.querySelector('.employee-code').value.trim(),
            name: row.cells[1].innerText.trim(),
            departmentName: row.cells[2].innerText.trim(),
            psNm: row.cells[3].innerText.trim(),
            status: row.cells[4].innerText.trim(),
        };
        employees.push(employee);
    });

    // 페이지네이션 설정
    $('#pagination-hr-empmag').pagination({
        dataSource: employees,
        pageSize: 10,
        callback: function(data, pagination) {
            var html = renderTable(data);
            $('#employeeTableBody').html(html);
        }
    });

    // 테이블 렌더링
    function renderTable(data) {
        var html = '';
        data.forEach(function(row) {
            html += `
            <tr>
                <td><input type="hidden" class="employee-code" value="${row.employeeCode}"></td>
                <td>${row.name}</td>
                <td>${row.departmentName}</td>
                <td>${row.psNm}</td>
                <td>${row.status}</td>
                <td>
                   <button type="button" class="modi-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                      수정
                   </button>
                   <button type="button" class="dele-btn">삭제</button>
                </td>
            </tr>`;
        });
        return html;
    }

    document.querySelector('#employeeTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('modi-btn')) {
            const tr = event.target.closest('tr');
            if (tr) {
                const hiddenInput = tr.querySelector('.employee-code');
                if (hiddenInput) {
                    const employeeCode = hiddenInput.value;
                    console.log('Employee Code:', employeeCode);

                    fetch(`/hr/empdetail?employeeCode=${employeeCode}`)
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('employeeCode').value = data.employeeCode;
                            document.getElementById('name').value = data.name;
                            document.getElementById('birth').value = data.birthDate;
                            document.getElementById('hire').value = data.hiredate;
                            document.getElementById('department').value = data.departmentName;
                            document.getElementById('position').value = data.psNm;
                            document.getElementById('status').value = data.status;
                        })
                        .catch(error => console.error('Error:', error));
                } else {
                    console.error('Hidden input not found');
                }
            } else {
                console.error('Table row not found');
            }
        }
    });
});
