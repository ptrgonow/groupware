
document.addEventListener("DOMContentLoaded", function() {
    // 테이블의 데이터를 JavaScript 배열로 가져오기
    var notices = [];
    document.querySelectorAll('#notice_cont tr').forEach(function(row) {
        var notice = {
            notice_id: row.cells[0].innerText,
            title: row.cells[1].innerText,
            content: row.cells[2].innerText,
            created_at: row.cells[3].innerText
        };
        notices.push(notice);
    });

    // 페이지네이션 설정
    $('#pagination-notice').pagination({
        dataSource: notices,
        pageSize: 6,
        callback: function(data, pagination) {
            var html = renderTable(data);
            $('#notice_cont').html(html);
        }
    });

    function renderTable(data) {
        var html = '';
        data.forEach(function(item) {
            html +=
                `
                    <tr>
                        <td>${item.notice_id}</td>
                        <td>${item.title}</td>
                        <td>${item.content}</td>
                        <td>${item.created_at}</td>
                    </tr>
                `;
        });
        return html;
    }
});
