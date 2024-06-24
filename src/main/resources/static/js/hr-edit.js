// hr-edit.js
document.addEventListener('DOMContentLoaded', function() {
    var statuses = [];

    // 서버에서 상태 값을 받아옵니다.
    fetch('/hr/statuses')
        .then(response => response.json())
        .then(data => {
            statuses = data;

            // 테이블의 데이터를 JavaScript 배열로 가져오기
            var employees = [];
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
        })
        .catch(error => {
            console.error('Error fetching statuses:', error);
        });

    // 테이블 렌더링
    function renderTable(data, statuses) {
        var html = '';

        data.forEach(function(row) {
            var statusOptions = statuses.map(function(status) {
                var selected = row.status === status ? 'selected' : '';
                return `<option value="${status}" ${selected}>${status}</option>`;
            }).join('');

            html += `
        <tr>
            <input type="hidden" class="employee-code" value="${row.employeeCode}">
            <td>${row.name}</td>
            <td>${row.departmentName}</td>
            <td>${row.psNm}</td>
            <td>
                <select class="st-select">
                    ${statusOptions}
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

                fetch('/hr/updatestatus', {
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
                            window.location.reload();
                        } else if (result.error === 'not_found') {
                            alert('해당 사원의 출근 기록이 없습니다.');
                            window.location.reload();
                        } else {
                            alert('상태 변경에 실패했습니다.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('상태 변경 중 오류가 발생했습니다.');
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
        const newEmployeeCode = document.getElementById('newEmployeeCode').value.trim(); // 새로운 employeeCode 필드
        const departmentName = document.getElementById('department').value.trim();
        const psNm = document.getElementById('position').value.trim();

        // 새 사원 번호가 비어 있으면 기존 사원 번호를 유지
        const finalEmployeeCode = newEmployeeCode || employeeCode;

        if (employeeCode === newEmployeeCode) {
            alert('입력하신 사원 코드는 현재 사원 코드와 동일합니다.');
            return;
        }

        const employeeUpdateDTO = {
            employeeCode: employeeCode,
            newEmployeeCode: finalEmployeeCode ,
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
                } else if (result.error === 'duplicate') {
                    alert('이미 존재하는 사원 코드입니다.');
                } else {
                    alert('사원 정보 수정에 실패했습니다.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('사원 정보 수정 중 오류가 발생했습니다.');
            });

    });

    // 모달 창 띄울 시 새 사원코드 입력 활성화/비활성화
    document.getElementById('enableNewEmployeeCode').addEventListener('change', function(event) {
        const newEmployeeCodeInput = document.getElementById('newEmployeeCode');
        if (this.checked) {
            newEmployeeCodeInput.placeholder = '';
        } else {
            newEmployeeCodeInput.placeholder = '변경 시 체크박스 클릭';
            newEmployeeCodeInput.value = '';
        }
        newEmployeeCodeInput.disabled = !this.checked;
    });

    // 모달이 닫힐 때 특정 필드 초기화
    var myModalEl = document.getElementById('staticBackdrop');
    myModalEl.addEventListener('hidden.bs.modal', function(event) {
        document.getElementById('newEmployeeCode').value = '';
    });
});

// 검색 처리 기능
function filter() {
    // 검색어 가져오기
    const searchTerm = document.getElementById('file-search-form').value.trim();
    // 테이블의 모든 행 가져오기
    const rows = document.querySelectorAll('#employeeTableBody tr');

    let found = false;
    rows.forEach(row => {
        // 사원 이름 가져오기
        const employeeName = row.cells[0].textContent;

        // 검색어와 일치하는지 확인
        if (employeeName.includes(searchTerm)) {
            row.style.display = ''; // 일치하면 보이기
            found = true;
        } else {
            row.style.display = 'none'; // 일치하지 않으면 숨기기
        }
    });
    // 검색 결과가 없을 경우 메시지 추가
    const employeeTableBody = document.getElementById('employeeTableBody');
    let noResultRow = document.getElementById('noResultRow');
    if (!found) {
        if (!noResultRow) {
            noResultRow = document.createElement('tr');
            noResultRow.id = 'noResultRow';
            noResultRow.className = 'no-result-row';
            noResultRow.innerHTML = '<td colspan="5">해당하는 사원이 없습니다.</td>';
            employeeTableBody.appendChild(noResultRow);
        }
        noResultRow.style.display = ''; // 메시지 표시
    } else {
        if (noResultRow) {
            noResultRow.style.display = 'none'; // 메시지 숨기기
        }
    }

    // 검색어가 없으면 페이징 보이기, 있으면 숨기기
    document.querySelector('.pagination-container').style.display = searchTerm === '' ? '' : 'none';

}
