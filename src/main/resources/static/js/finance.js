
$(document).ready(function() {
    // 초기 화면 설정
    getSalaryList();

    // 변수 선언



    // 이벤트 리스너 등록

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


