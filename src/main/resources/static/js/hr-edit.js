document.addEventListener('DOMContentLoaded', function() {
    // 테이블의 데이터를 JavaScript 배열로 가져오기
    var employees = [];
    document.querySelectorAll('#employeeTableBody tr').forEach(function(row) {
        var employee = {
            employeeCode: row.querySelector('.employee-code').value.trim(),
            name: row.cells[0].innerText.trim(),
            departmentName: row.cells[1].innerText.trim(),
            psNm: row.cells[2].innerText.trim(),
            status: row.cells[3].innerText.trim() || '퇴근'
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
                <input type="hidden" class="employee-code" value="${row.employeeCode}">
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

    // 데이터를 select 요소에 추가
    function emplSelectElement(selectId, options) {
        const selectElement = document.getElementById(selectId);
        options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            selectElement.appendChild(option);
        });
    }

    // 부서, 직급, 상태 데이터를 미리 불러오기
    fetch('/hr/empmodi')
        .then(response => response.json())
        .then(metadata => {
            emplSelectElement('department', metadata.departments);
            emplSelectElement('position', metadata.positions);
            emplSelectElement('status', metadata.statuses);
        });

    document.querySelector('#employeeTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('dele-btn')) {
            const tr = event.target.closest('tr');
            if (tr) {
                const hiddenInput = tr.querySelector('.employee-code');
                if (hiddenInput) {
                    const employeeCode = hiddenInput.value;

                    // 삭제 확인 메시지 표시
                    const confirmed = confirm('정말 해당 사원을 삭제하겠습니까?');
                    if (confirmed) {
                        // 서버로 삭제 요청 전송
                        fetch(`/hr/empdelete?employeeCode=${employeeCode}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ employeeCode: employeeCode })
                        })
                            .then(response => {
                                return response.json();
                            })
                            .then(result => {
                                // 디버깅: 서버 응답 데이터 확인
                                console.log('Result:', result);
                                if (result.success) {
                                    alert('사원이 삭제되었습니다.');
                                    location.reload();
                                } else {
                                    alert('사원 삭제에 실패했습니다.');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('사원 삭제 중 오류가 발생했습니다.');
                            });
                    }
                } else {
                    console.error('Hidden input not found');
                }
            } else {
                console.error('Table row not found');
            }
        }

        if (event.target.classList.contains('modi-btn')) {
            const tr = event.target.closest('tr');
            if (tr) {
                const hiddenInput = tr.querySelector('.employee-code');
                if (hiddenInput) {
                    const employeeCode = hiddenInput.value;

                    fetch(`/hr/empdetail?employeeCode=${employeeCode}`)
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('employeeCode').value = data.employeeCode;
                            document.getElementById('name').value = data.name;
                            document.getElementById('birth').value = data.birthDate;
                            document.getElementById('hire').value = data.hiredate;
                            document.getElementById('department').value = data.departmentName;
                            document.getElementById('position').value = data.psNm;
                            document.getElementById('status').value = data.status || '퇴근';
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


