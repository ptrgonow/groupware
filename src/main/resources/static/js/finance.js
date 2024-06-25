var mySubmissions = [];

$(document).ready(function() {
    // 초기 화면 설정
    getSalaryList();



    // 이벤트 리스너 등록

    $(document).on('click', '#fm-tbl-approved-list tr', function () {
        var approvalId = $(this).data('approval-id');
        console.log(approvalId);

        $.get({
            url: `/ap/gt/${approvalId}`,
            success: function (token) {
                window.location.href = `/ap/detail/${token}`;
            }
        });
    });


});

// ==================== 함수 정의 ==================== //

// 급여 조회
function getSalaryList(pageNumber = 1) {

    $.ajax({
        type: 'GET',
        url: '/fi/sal/list',
        dataType: 'json',
        data: {page: pageNumber, pageSize: 6},
        success: function(response) {
            console.log(response); // 응답 데이터 확인
            if (response && response.salList) {
                paginate(response.totalItem, response.salList)
            } else {
                console.error('Invalid response format:', response);
            }
        },
    });
}

// 페이지네이트
function paginate(totalItem, salList) {
    $('#pagination-mini').pagination({
        dataSource: salList,
        pageSize: 6,
        showPageNumbers: false,
        callback: function(data, pagination) {
            const salTbl = $('#salTbl');
            salTbl.empty();
            data.forEach(function(sal) {
                const salItem = `
                    <tr>
                        <td>${sal.employeeName}</td>
                        <td>${sal.departmentName}</td>
                        <td>${sal.positionName}</td>
                        <td>${sal.salary}</td>
                        
                    </tr>
                `;
                salTbl.append(salItem);
            });
        }
    });
}

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
