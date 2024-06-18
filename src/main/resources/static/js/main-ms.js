document.addEventListener("DOMContentLoaded", function() {
    const pageSize = 6; // 페이지당 항목 수

    // 인원 현황 테이블 페이징 처리
    const allEmployeeTableBody = document.querySelector('#allEmployeeTableBody');
    const allEmployeeTableRows = Array.from(allEmployeeTableBody.querySelectorAll('tr'));
    const employees = [];
    allEmployeeTableRows.forEach(function(row) {
        var employee = {
            employeeName: row.cells[0].innerText.trim(),
            departmentName: row.cells[1].innerText.trim(),
            positionName: row.cells[2].innerText.trim(),
            status: row.cells[3].innerText.trim()
        };
        employees.push(employee);
    });

    $('#pagination-container').pagination({
        dataSource: employees,
        pageSize: pageSize,
        callback: function(data, pagination) {
            var html = renderEmployeeTable(data);
            $('#allEmployeeTableBody').html(html);
        }
    });

    // 인원 현황 테이블 렌더링 함수
    function renderEmployeeTable(data) {
        var html = '';
        data.forEach(function(item) {
            html +=
                `<tr>
                <td>
                    <div class="table-img">
                        <label>${item.employeeName}</label>
                    </div>
                </td>
                <td>
                    <label class="action_label2">${item.departmentName}</label>
                </td>
                <td>
                    <label>${item.positionName}</label>
                </td>
                <td>
                   <span class="${item.status === '근무중' ? 'badge bg-success text-center' : 'badge bg-danger text-center'}">${item.status}</span>
                </td>
            </tr>`;
        });
        return html;
    }

    // 인사 결재 요청 테이블 페이징 처리 (수정된 부분)
    const approvalData = [];
    document.querySelectorAll('#approvalTable #approvalTableBody tr').forEach(row => {
        approvalData.push({
            index: row.cells[0].innerText.trim(),
            title: row.cells[1].innerText.trim(),
            name: row.cells[2].innerText.trim(),
            createdAt: row.cells[3].innerText.trim(),
            status: row.cells[4].innerText.trim()
        });
    });

    // Pagination.js 설정 (금일 근무자 테이블)
    $('#approvalPagination-container').pagination({
        dataSource: approvalData,
        pageSize: pageSize,
        callback: function(data, pagination) {
            // 페이지 변경 시 테이블 내용 업데이트
            $('#approvalTable #approvalTableBody').empty();
            data.forEach(approval => {
                $('#approvalTable #approvalTableBody').append(`
                    <tr>
                        <td>${approval.index}</td>
                        <td>${approval.title}</td>
                        <td>${approval.name}</td>
                        <td>${approval.createdAt}</td>
                        <td>${approval.status}</td>
                    </tr>
                `);
            });
        }
    });
    const fmApprovalData = [];
    document.querySelectorAll('#fmApprovalTable #fmApprovalTableBody tr').forEach(row => {
        fmApprovalData.push({
            index: row.cells[0].innerText.trim(),
            title: row.cells[1].innerText.trim(),
            name: row.cells[2].innerText.trim(),
            createdAt: row.cells[3].innerText.trim(),
            status: row.cells[4].innerText.trim()
        });
    });

    // Pagination.js 설정 (금일 근무자 테이블)
    $('#fm-ApprovalPagination-container').pagination({
        dataSource: fmApprovalData,
        pageSize: pageSize,
        callback: function(data, pagination) {
            // 페이지 변경 시 테이블 내용 업데이트
            $('#fmApprovalTable #fmApprovalTableBody').empty();
            data.forEach(fmApproval => {
                $('#fmApprovalTable #fmApprovalTableBody').append(`
                    <tr>
                        <td>${fmApproval.index}</td>
                        <td>${fmApproval.title}</td>
                        <td>${fmApproval.name}</td>
                        <td>${fmApproval.createdAt}</td>
                        <td>${fmApproval.status}</td>
                    </tr>
                `);
            });
        }
    });
});