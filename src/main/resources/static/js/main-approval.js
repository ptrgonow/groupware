$(document).ready(function () {
    function initializePagination(dataSource, tableBodyId, paginationId) {
        $(paginationId).pagination({
            dataSource: dataSource,
            pageSize: 6,
            callback: function (data, pagination) {
                var html = renderTable(data);
                $(tableBodyId).html(html);
            }
        });
    }

    function renderTable(data) {
        var html = '';
        data.forEach(function (item, index) {
            html += `
                <tr data-approval-id="${item.approvalId}">
                    <td>${index + 1}</td>
                    <td>${item.fileCd}</td>
                    <td>${item.employeeName}</td>
                    <td>${item.createdAt}</td>
                    <td>${item.status}</td>
                </tr>
            `;
        });
        return html;
    }

    var mySubmissions = []; // 상신 목록 데이터
    var myPendingApprovals = []; // 결재 목록 데이터
    var myReceivedApprovals = []; // 합의 목록 데이터
    var myCompletedApprovals = []; // 결재 완료 데이터

    // 각 테이블의 데이터를 배열로 수집
    $('#toAp-tbody tr').each(function () {
        var row = $(this).children('td');
        mySubmissions.push({
            approvalId: $(this).data('approval-id'), // 고유 ID 추가
            fileCd: row.eq(1).text(),
            employeeName: row.eq(2).text(),
            createdAt: row.eq(3).text(),
            status: row.eq(4).text()
        });
    });

    $('#myAp-tbody tr').each(function () {
        var row = $(this).children('td');
        myPendingApprovals.push({
            approvalId: $(this).data('approval-id'), // 고유 ID 추가
            fileCd: row.eq(1).text(),
            employeeName: row.eq(2).text(),
            createdAt: row.eq(3).text(),
            status: row.eq(4).text()
        });
    });

    $('#cuAp-tbody tr').each(function () {
        var row = $(this).children('td');
        myReceivedApprovals.push({
            approvalId: $(this).data('approval-id'), // 고유 ID 추가
            fileCd: row.eq(1).text(),
            employeeName: row.eq(2).text(),
            createdAt: row.eq(3).text(),
            status: row.eq(4).text()
        });
    });

    $('#coAp-tbody tr').each(function () {
        var row = $(this).children('td');
        myCompletedApprovals.push({
            approvalId: $(this).data('approval-id'), // 고유 ID 추가
            fileCd: row.eq(1).text(),
            employeeName: row.eq(2).text(),
            createdAt: row.eq(3).text(),
            status: row.eq(4).text()
        });
    });

    // 페이지네이션 초기화
    initializePagination(mySubmissions, '#toAp-tbody', '#pagination-toAp');
    initializePagination(myPendingApprovals, '#myAp-tbody', '#pagination-myAp');
    initializePagination(myReceivedApprovals, '#cuAp-tbody', '#pagination-cuAp');
    initializePagination(myCompletedApprovals, '#coAp-tbody', '#pagination-coAp');

    // 각 테이블 행에 클릭 이벤트 추가
    $(document).on('click', '#toAp-tbody tr, #myAp-tbody tr, #cuAp-tbody tr, #coAp-tbody tr', function () {
        var approvalId = $(this).data('approval-id');
        window.location.href = `/ap/detail/${approvalId}`;
    });
});
