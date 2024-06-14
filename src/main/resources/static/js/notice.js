document.addEventListener('DOMContentLoaded', function () {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageLinks = document.querySelectorAll('.page-link');

    // 이전 페이지로 이동하는 이벤트 리스너
    prevPageBtn.addEventListener('click', function () {
        const currentPage = parseInt(prevPageBtn.dataset.currentPage);
        if (currentPage > 1) {
            fetchPage(currentPage - 1);
        }
    });

    // 다음 페이지로 이동하는 이벤트 리스너
    nextPageBtn.addEventListener('click', function () {
        const currentPage = parseInt(nextPageBtn.dataset.currentPage);
        fetchPage(currentPage + 1);
    });

    // 각 페이지로 이동하는 이벤트 리스너
    pageLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageNumber = parseInt(link.textContent);
            fetchPage(pageNumber);
        });
    });

    function fetchPage(pageNumber) {
        const itemsPerPage = 5; // 한 페이지에 보여줄 데이터의 수

        $.ajax({
            url: "/get-data",
            type: "GET",
            data: {
                page: pageNumber,
                limit: itemsPerPage // 한 페이지에 보여줄 아이템 수를 서버에 전달
            },
            success: function (response) {
                displayData(response);
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    }

    function displayData(data) {
        // 서버로부터 받은 데이터를 페이지에 표시하는 로직을 여기에 추가합니다.
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
