
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

    function setupNoticePagination(totalItems, noticeList) {
        $('#demo').pagination({
            dataSource: noticeList,
            pageSize: 5,
            showPageNumbers: true,
            showNavigator: true,
            callback: function(data, pagination) {
                var noticeContainer = $('#notice-list');
                noticeContainer.empty();
                data.forEach(function(notice, index) {
                    var listItem = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${notice.title}</td>
                        <td>${notice.content}</td>
                        <td>${notice.created_at}</td>
                    </tr>`;
                    noticeContainer.append(listItem);
                });
            }
        });
    }

    function loadNotices() {
        $.ajax({
            url: '/nt/notices',
            type: 'GET',
            success: function(response) {
                setupNoticePagination(response.length, response);
            },
            error: function() {
                alert('공지사항 데이터를 가져오는 데 실패했습니다.');
            }
        });
    }

    $(document).ready(function() {
        loadNotices();
    });





});
