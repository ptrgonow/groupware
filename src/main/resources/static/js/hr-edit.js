document.addEventListener("DOMContentLoaded", function() {
    // 테이블의 데이터를 JavaScript 배열로 가져오기
    var employees = [];
    document.querySelectorAll('#employeeTableBody tr').forEach(function (row) {
        var employee = {
            name: row.cells[0].innerText.trim(),
            departmentName: row.cells[1].innerText.trim(),
            psNm: row.cells[2].innerText.trim(),
            status: row.cells[3].innerText.trim()
        };
        employees.push(employee);
    });

    // 페이지네이션 설정
    $('#pagination-hr-empmag').pagination({
        dataSource: employees,
        pageSize: 10,
        callback: function (data, pagination) {
            var html = renderTable(data);
            $('#employeeTableBody').html(html);
        }
    });

    // 테이블 렌더링
    function renderTable(data){
        var html = '';
        data.forEach(function (row) {
            html += `
            <tr>
                <td>${row.name}</td>
                <td>${row.departmentName}</td>
                <td>${row.psNm}</td>
                <td>${row.status}</td>
                <td>
                   <button type="button" class="modi-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                      수정
                   </button>
                   <button type="button" class="dele-btn">삭제</button>
                </td>
            </tr>`;
        });
        return html;
    }

});



// // 모달이 안 떠..
// $(document).ready(function() {
//     $('#empModiModal').on('show.bs.modal', function(event) {
//         var button = $(event.relatedTarget);
//         var employeeCode = button.data('employee-code');
//
//         // AJAX 요청을 통해 DB에서 사원 정보를 가져와서 모달 폼에 채워줌
//         $.ajax({
//             url: '/hr/edit/' + employeeCode,
//             method: 'GET',
//             success: function(data) {
//
//                 $('#EmployeeCode').val(data.employee_code);
//                 $('#name').val(data.name);
//                 $('#birth').val(data.birth_date);
//                 $('#address').val(data.address);
//                 $('#department').val(data.department_id);
//                 $('#position').val(data.ps_cd);
//             },
//             error: function(error) {
//                 console.log(error);
//                 alert('사원 정보를 불러오는 데 문제가 발생했습니다.');
//             }
//         });
//     });
// });