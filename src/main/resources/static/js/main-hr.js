document.addEventListener("DOMContentLoaded", function() {
    initializeEmployees();
    initializeTodayWorkers();
    initializeHrApproval();
});

function initializeEmployees() {
    var employees = [];
    document.querySelectorAll('#e_list_table tr').forEach(function(row) {
        var employee = {
            name: row.cells[0].innerText.trim(),
            departmentName: row.cells[1].innerText.trim(),
            psNm: row.cells[2].innerText.trim()
        };
        employees.push(employee);
    });

    $('#pagination-hr').pagination({
        dataSource: employees,
        pageSize: 6,
        callback: function(data, pagination) {
            var html = renderTable(data);
            $('#e_list_table').html(html);
        }
    });

    function renderTable(data) {
        var html = '';
        data.forEach(function(item) {
            html += `
                <tr>
                    <td>
                        <div class="table-img">
                            <label>${item.name}</label>
                        </div>
                    </td>
                    <td>
                        <label class="action_label2">${item.departmentName}</label>
                    </td>
                    <td>
                        <label>${item.psNm}</label>
                    </td>
                </tr>`;
        });
        return html;
    }
}

function initializeTodayWorkers() {
    const todayWorkers = [];
    document.querySelectorAll('#today-workers-table #today-workers-data tr').forEach(row => {
        todayWorkers.push({
            name: row.cells[0].innerText,
            firstCheckIn: row.cells[1].innerText,
            status: row.cells[2].innerText
        });
    });

    $('#pagination-today-workers-pagination-hr').pagination({
        dataSource: todayWorkers,
        pageSize: 6,
        callback: function(data, pagination) {
            $('#today-workers-table #today-workers-data').empty();
            data.forEach(worker => {
                $('#today-workers-table #today-workers-data').append(`
                    <tr>
                        <td>${worker.name}</td>
                        <td>${worker.firstCheckIn}</td>
                        <td><span class="${worker.status === '근무중' ? 'badge bg-success' : 'badge bg-danger'}">${worker.status}</span></td>
                    </tr>
                `);
            });
        }
    });
}

function initializeHrApproval() {
    var hrApproval = [];
    document.querySelectorAll('.team-list').forEach(function(view) {
        var approval = {
            name: view.querySelector('.ap-name').innerText.trim(),
            department: view.querySelector('.ap-dep').innerText.trim(),
            title: view.querySelector('#ap-title').innerText.trim(),
            createdAt: view.querySelector('#ap-date').innerText.trim(),
            status: view.querySelector('#ap-status').innerText.trim()
        };
        hrApproval.push(approval);
    });

    $('#hrApproval-Pagination').pagination({
        dataSource: hrApproval,
        pageSize: 6,
        callback: function(data, pagination) {
            var html = renderApproval(data);
            $('#initial-hrApproval-container').html(html);
        }
    });

    function renderApproval(data) {
        var html = '';
        data.forEach(function(request) {
            html += `
                <tr>
                   <td class="ap-name">${request.name}</td>
                <td class="ap-dep">${request.department}</td>
                <td class="ap-cont">${request.title}</td> 
                <td class="ap-cont">${request.createdAt}</td>
                <td class="ap-cont">${request.status}</td>
                </tr>`;
        });
        return html;
    }
}
