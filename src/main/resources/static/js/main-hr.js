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
});