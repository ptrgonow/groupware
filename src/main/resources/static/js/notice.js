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
});
