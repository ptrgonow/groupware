// hr-edit.js
document.addEventListener('DOMContentLoaded', function() {
    var statuses = [];
    var employees = [];

    // 서버에서 상태 값을 받아옵니다.
    fetch('/hr/statuses')
        .then(response => response.json())
        .then(data => {
            statuses = data;
            loadEmployeeData();
        })
        .catch(error => {
            console.error('Error fetching statuses:', error);
        });

    function loadEmployeeData() {
        // 테이블의 데이터를 JavaScript 배열로 가져오기
        employees = [];
        document.querySelectorAll('#employeeTableBody tr').forEach(function(row) {
            var employee = {
                employeeCode: row.querySelector('.employee-code').value.trim(),
                name: row.cells[0].innerText.trim(),
                departmentName: row.cells[1].innerText.trim(),
                psNm: row.cells[2].innerText.trim(),
                status: row.querySelector('select').value.trim() || '퇴근'
            };
            employees.push(employee);
        });

        // 페이지네이션 설정
        $('#pagination-hr-empmag').pagination({
            dataSource: employees,
            pageSize: 10,
            callback: function(data, pagination) {
                var html = renderTable(data, statuses);
                $('#employeeTableBody').html(html);
            }
        });
    }

    // 테이블 렌더링
    function renderTable(data, statuses) {
        var html = '';

        data.forEach(function(row) {
            var status = row.status || '퇴근';

            var statusOptions = statuses.map(function(statusOption) {
                var selected = status === statusOption ? 'selected' : '';
                return `<option value="${statusOption}" ${selected}>${statusOption}</option>`;
            }).join('');

            html += `
        <tr>
            <input type="hidden" class="employee-code" value="${row.employeeCode}">
            <td>${row.name}</td>
            <td>${row.departmentName}</td>
            <td>${row.psNm}</td>
            <td>
                <select class="st-select">
                    <option value="휴가" ${row.status === '휴가' ? 'selected' : ''}>휴가</option>
                    <option value="근무중" ${row.status === '근무중' ? 'selected' : ''}>근무중</option>
                    <option value="퇴근" ${row.status === '퇴근' ? 'selected' : ''}>퇴근</option>
                </select>
                <button type="submit" class="st-btn">변경</button>
            </td>
            <td>
                <button type="button" class="modi-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    수정
                </button>
                <button type="button" class="dele-btn">삭제</button>
            </td>
        </tr>
        `;
        });
        return html;
    }

    // 상태 변경 버튼 클릭시 변경
    document.querySelector('#employeeTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('st-btn')) {
            const tr = event.target.closest('tr');
            if (tr) {
                const employeeCode = tr.querySelector('.employee-code').value.trim();
                const newStatus = tr.querySelector('.st-select').value.trim();

                fetch(`/hr/status/${employeeCode}`)
                    .then(response => response.json())
                    .then(currentStatusDTO => {
                        const currentStatus = currentStatusDTO.status;
                        if (currentStatus === '근무중' && newStatus === '휴가') {
                            alert('퇴근 기록을 저장한 후 다시 시도하세요.');
                            location.reload();
                            return;
                        } else if (currentStatus === '휴가' && newStatus === '퇴근') {
                            alert('출근 기록이 없어 퇴근 상태로 변경할 수 없습니다.');
                            location.reload();
                            return;
                        }

                        return fetch('/hr/updatestatus', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ employeeCode: employeeCode, status: newStatus })
                        })
                            .then(response => response.json())
                            .then(result => {
                                if (result.success) {
                                    alert('상태 변경 완료.');
                                    location.reload();
                                } else if (result.error === 'not_found') {
                                    alert('해당 사원의 출근 기록이 없습니다.');
                                    location.reload();
                                } else {
                                    alert('상태 변경에 실패했습니다.');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('상태 변경 중 오류가 발생했습니다.');
                            });
                    })
                    .catch(error => {
                        console.error('Error fetching current status:', error);
                        alert('상태 확인 중 오류가 발생했습니다.');
                    });
            }
        }
    });

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
                            .then(response => response.json())
                            .then(result => {
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
    });

    document.querySelector('#employeeTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('modi-btn')) {
            const tr = event.target.closest('tr');
            if (tr) {
                const hiddenInput = tr.querySelector('.employee-code');
                if (hiddenInput) {
                    const employeeCode = hiddenInput.value;

                    fetch(`/hr/empdetail?employeeCode=${employeeCode}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log('Fetched Data:', data); // 데이터 확인
                            if (data) {
                                document.getElementById('employeeCode').value = data.employeeCode;
                                document.getElementById('name').value = data.name;
                                document.getElementById('birth').value = data.birthDate;
                                document.getElementById('hire').value = data.hiredate;
                                document.getElementById('department').value = data.departmentName;
                                document.getElementById('position').value = data.psNm;
                            } else {
                                console.error('Employee info not found');
                            }
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

    document.getElementById('info').addEventListener('submit', function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음

        const employeeCode = document.getElementById('employeeCode').value.trim();
        const departmentName = document.getElementById('department').value.trim();
        const psNm = document.getElementById('position').value.trim();

        const employeeUpdateDTO = {
            employeeCode: employeeCode,
            departmentName: departmentName,
            psNm: psNm,
        };

        fetch('/hr/empupdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeUpdateDTO)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('사원 정보가 수정되었습니다.');
                    location.reload();
                } else {
                    alert('사원 정보 수정에 실패했습니다.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('사원 정보 수정 중 오류가 발생했습니다.');
            });
    });

    // 검색 입력 이벤트 리스너 추가
    document.getElementById('file-search-form').addEventListener('input', filter);
});

// 검색 처리 기능
function filter() {
    const searchTerm = document.getElementById('file-search-form').value.trim();

    if (searchTerm === '') {
        // 검색어가 없으면 초기 데이터 로드
        loadEmployeeData();
        document.querySelector('.pagination-container').style.display = '';
        return;
    }

    $.ajax({
        url: '/hr/search',
        method: 'GET',
        data: { search: searchTerm },
        success: function(response) {
            const users = response.users;
            const statuses = response.status;

            const employeeTableBody = document.getElementById('employeeTableBody');
            employeeTableBody.innerHTML = '';

            if (users.length > 0) {
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                            <input type="hidden" class="employee-code" value="${user.employeeCode}">
                            <td>${user.name}</td>
                            <td>${user.departmentName}</td>
                            <td>${user.psNm}</td>
                            <td>
                                <select class="st-select">
                                    ${statuses.map(status => `<option value="${status}" ${status === user.status ? 'selected' : ''}>${status}</option>`).join('')}
                                </select>
                                <button type="submit" class="st-btn">변경</button>
                            </td>
                            <td>
                                <button type="button" class="modi-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">수정</button>
                                <button type="button" class="dele-btn">삭제</button>
                            </td>
                        `;
                    employeeTableBody.appendChild(row);
                });
            } else {
                const noResultRow = document.createElement('tr');
                noResultRow.id = 'noResultRow';
                noResultRow.className = 'no-result-row';
                noResultRow.innerHTML = '<td colspan="5">해당하는 사원이 없습니다.<a href="/hr/edit" class="list-btn">전체목록</a></td>';
                employeeTableBody.appendChild(noResultRow);
            }
        },
        error: function(error) {
            console.error('Error fetching search results:', error);
        }
    });

    // 검색어가 있으면 페이징 숨기기
    document.querySelector('#pagination-hr-empmag').style.display = 'none';
}
