document.addEventListener("DOMContentLoaded", function() {
    // 테이블의 데이터를 JavaScript 배열로 가져오기
    var employees = [];
    document.querySelectorAll('#e_list_table tr').forEach(function(row) {
        var employee = {
            name: row.cells[0].innerText.trim(),
            departmentName: row.cells[1].innerText.trim(),
            psNm: row.cells[2].innerText.trim()
        };
        employees.push(employee);
    });

    // 페이지네이션 설정
    $('#pagination-hr').pagination({
        dataSource: employees,
        pageSize: 6,
        callback: function(data, pagination) {
            var html = renderTable(data);
            $('#e_list_table').html(html);
        }
    });

    // 테이블을 렌더링
    function renderTable(data) {
        var html = '';
        data.forEach(function(item) {
            html +=
                `<tr>
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
    const todayWorkers = [];
    document.querySelectorAll('#today-workers-table #today-workers-data tr').forEach(row => {
        todayWorkers.push({
            name: row.cells[0].innerText,
            firstCheckIn: row.cells[1].innerText,
            status: row.cells[2].innerText
        });
    });

    // Pagination.js 설정 (금일 근무자 테이블)
    $('#pagination-today-workers-pagination-hr').pagination({
        dataSource: todayWorkers,
        pageSize: 6,
        callback: function(data, pagination) {
            // 페이지 변경 시 테이블 내용 업데이트
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
});