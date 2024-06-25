var mySubmissions = []; // 상신 목록 데이터
var myPendingApprovals = []; // 결재 목록 데이터
var myReceivedApprovals = []; // 합의 목록 데이터
var myCompletedApprovals = []; // 결재 완료 데이터

$(document).ready(function () {

    // 각 테이블의 데이터를 배열로 수집
    collectTableData('#toAp-tbody', mySubmissions);
    collectTableData('#myAp-tbody', myPendingApprovals);
    collectTableData('#cuAp-tbody', myReceivedApprovals);
    collectTableData('#coAp-tbody', myCompletedApprovals);

    // 페이지네이션 초기화
    initializePagination(mySubmissions, '#toAp-tbody', '#pagination-toAp');
    initializePagination(myPendingApprovals, '#myAp-tbody', '#pagination-myAp');
    initializePagination(myReceivedApprovals, '#cuAp-tbody', '#pagination-cuAp');
    initializePagination(myCompletedApprovals, '#coAp-tbody', '#pagination-coAp');

    $(document).on('click', '#toAp-tbody tr, #myAp-tbody tr, #cuAp-tbody tr, #coAp-tbody tr', function () {
        var approvalId = $(this).data('approval-id');

        $.get({
            url: `/ap/gt/${approvalId}`,
            success: function (token) {
                window.location.href = `/ap/detail/${token}`;
            }
        });``
    });
});

function collectTableData(tableBodySelector, dataArray) {
    $(tableBodySelector + ' tr').each(function () {
        var row = $(this).children('td');
        dataArray.push({
            approvalId: $(this).data('approval-id'), // 고유 ID 추가
            fileCd: row.eq(1).text(),
            employeeName: row.eq(2).text(),
            createdAt: row.eq(3).text(),
            status: row.eq(4).text()
        });
    });
}

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
