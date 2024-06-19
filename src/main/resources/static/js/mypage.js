
document.addEventListener("DOMContentLoaded", function() {
    // 테이블의 데이터를 JavaScript 배열로 가져오기
    var works = [];
    document.querySelectorAll('#work_table tbody tr').forEach(function(row) {
        var work = {
            date: row.cells[0].innerText,
            checkIn: row.cells[1].innerText,
            checkOut: row.cells[2].innerText,
            workTime: row.cells[3].innerText
        };
        works.push(work);
    });

    // 페이지네이션 설정
    $('#pagination-work').pagination({
        dataSource: works,
        pageSize: 6,
        callback: function(data, pagination) {
            var html = renderTable(data);
            $('#work_record_body').html(html);
        }
    });

    function renderTable(data) {
        var html = '';
        data.forEach(function(item) {
            html +=
                `
                        <tr>
                            <td>${item.date}</td>
                            <td>${item.checkIn}</td>
                            <td>${item.checkOut}</td>
                            <td>${item.workTime}</td>
                        </tr>
                        `;
        });
        return html;
    }
});
