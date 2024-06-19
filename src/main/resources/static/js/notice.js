document.addEventListener("DOMContentLoaded", function() {
    var notices = []; // 초기화할 필요 없음

    // 페이지네이션 설정 함수
    function setupPagination(data) {
        $('#pagination-notice').pagination({
            dataSource: data,
            pageSize: 6,
            callback: function(data, pagination) {
                var html = renderTable(data);
                $('#notice_cont').html(html);
            }
        });
    }

    // 테이블의 데이터를 JavaScript 배열로 가져오는 함수
    function fetchDataAndSetupPagination() {
        notices = []; // 데이터 초기화
        document.querySelectorAll('#notice_cont tr').forEach(function(row) {
            var notice_id = row.querySelector('input[type=hidden]').value;
            var title = row.cells[1].querySelector('a').innerText; // <a> 태그 내부의 텍스트 가져오기
            var content = row.cells[2].innerText;
            var created_at = row.cells[3].innerText;

            var notice = {
                notice_id: notice_id,
                title: title,
                content: content,
                created_at: created_at
            };
            notices.push(notice);
        });

        // 페이지네이션 설정
        setupPagination(notices);
    }

    // 초기 데이터 로딩
    fetchDataAndSetupPagination();

    // 예제로 데이터가 변경되었다고 가정
    // fetchDataAndSetupPagination(); // 데이터가 변경되었을 때 다시 호출

    function renderTable(data) {
        var html = '';
        data.forEach(function(item) {
            var detailUrl = '/nt/detail?id=' + item.notice_id;  // 상세 페이지 URL 생성
            html +=
                `<tr>
                <td>${item.notice_id}</td>
                <td><a href="${detailUrl}">${item.title}</a></td>
                <td>${item.content}</td>
                <td>${item.created_at}</td>
             </tr>`;
        });
        return html;
    }
});
