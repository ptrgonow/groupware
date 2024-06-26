document.addEventListener("DOMContentLoaded", function () {
    // 테이블의 데이터를 JavaScript 배열로 가져오기
    var notices = [];
    document.querySelectorAll('#notice_cont tr').forEach(function (row, index) { // index 매개변수 추가
        var notice = {
            notice_id: row.getAttribute('data-notice-id'),
            title: row.cells[1].innerText,
            content: row.cells[2].innerText,
            created_at: row.cells[3].innerText
        };
        notices.push(notice);
    });

    // 페이지네이션 설정
    $('#pagination-notice').pagination({
        dataSource: notices,
        pageSize: 10,
        callback: function (data, pagination) {
            var html = renderTable(data, pagination.pageNumber); // 페이지 번호 전달
            $('#notice_cont').html(html);
        }
    });

    // 테이블 렌더링 함수
    function renderTable(data, pageNumber) { // 페이지 번호 매개변수 추가
        var html = '';
        data.forEach(function (item, index) { // index 매개변수 추가
            var rowNumber = (pageNumber - 1) * 10 + index + 1; // 페이지 번호를 고려한 행 번호 계산
            var detailUrl = '/nt/detail?id=' + item.notice_id;
            html += `
                <tr>
                    <td>${rowNumber}</td> <!-- 행 번호 표시 -->
                    <td><a href="${detailUrl}" data-notice-id="${item.notice_id}">${item.title}</a></td>
                    <td>${item.content}</td>
                    <td>${item.created_at}</td>
                </tr>`;
        });
        return html;
    }
});
