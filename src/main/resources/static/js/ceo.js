document.addEventListener("DOMContentLoaded", function() {
    const pageSize = 8;

    // 결재 테이블 페이징 처리
    const approvalTableBody = document.querySelector('#myAp-tbody');
    const approvalTableRows = Array.from(approvalTableBody.querySelectorAll('tr'));
    const approvals = approvalTableRows.map(row => ({
        number: row.cells[0].innerText.trim(),
        title: row.cells[1].innerText.trim(),
        author: row.cells[2].innerText.trim(),
        date: row.cells[3].innerText.trim(),
        status: row.cells[4].innerText.trim()
    }));

    $('#pagination-myAp').pagination({
        dataSource: approvals,
        pageSize: pageSize,
        callback: function(data, pagination) {
            var html = renderApprovalTable(data);
            $('#myAp-tbody').html(html);
        }
    });

    function renderApprovalTable(data) {
        return data.map(ap => `
            <tr>
                <td>${ap.number}</td>
                <td>${ap.title}</td>
                <td>${ap.author}</td>
                <td>${ap.date}</td>
                <td>${ap.status}</td>
            </tr>
        `).join('');
    }




    // 인사 테이블 페이징 처리
    const employeeTableBody = document.querySelector('#allEmployeeTableBody');
    const employeeTableRows = Array.from(employeeTableBody.querySelectorAll('tr'));
    const employees = employeeTableRows.map(row => ({
        employeeName: row.cells[0].innerText.trim(),
        departmentName: row.cells[1].innerText.trim(),
        positionName: row.cells[2].innerText.trim(),
        status: row.cells[3].innerText.trim()
    }));

    $('#pagination-hr').pagination({
        dataSource: employees,
        pageSize: 10,
        callback: function(data, pagination) {
            var html = renderEmployeeTable(data);
            $('#allEmployeeTableBody').html(html);
        }
    });

    function renderEmployeeTable(data) {
        return data.map(emp => `
            <tr>
                <td>${emp.employeeName}</td>
                <td>${emp.departmentName}</td>
                <td>${emp.positionName}</td>
                <td>
                    <span class="${emp.status === '근무중' ? 'badge bg-success text-center' : 'badge bg-danger text-center'}">
                        ${emp.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }





        // 개발 테이블 페이징 처리
        const projectTableBody = document.querySelector('#project_table_body');
        const projectTableRows = Array.from(projectTableBody.querySelectorAll('tr'));
        const projects = projectTableRows.map(row => ({
            number: row.cells[0].innerText.trim(),
            projectName: row.cells[1].innerText.trim(),
            status: row.cells[2].innerText.trim()
        }));

        $('#pagination-pro').pagination({
            dataSource: projects,
            pageSize: pageSize,
            callback: function(data, pagination) {
                var html = renderProjectTable(data);
                $('#project_table_body').html(html);
            }
        });

        function renderProjectTable(data) {
            return data.map(pr => `
            <tr>
                <td class="col-t1" >${pr.number}</td>
                <td class="col-t2">${pr.projectName}</td>
                <td class="col-t3">${pr.status}</td>
            </tr>
        `).join('');
        }

    });




