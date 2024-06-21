$(document).ready(function() {

    initializeDisplay();
    updateDisplayedUserInfo();

    $('#registerForm').on('submit', function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 방지

        const formData = $(this).serialize(); // 폼 데이터를 직렬화

        $.ajax({
            url: '/user/register',
            method: 'POST',
            data: formData,
            success: function(response) {
                alert(response.message);
                // UI 업데이트가 필요하다면 여기에서 처리
            },
            error: function(error) {
                alert('등록 실패: ' + error.responseText);
            }
        });
    });

    $('#updateForm').on('submit', function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 방지

        const formData = $(this).serialize(); // 폼 데이터를 직렬화

        $.ajax({
            url: '/user/update',
            method: 'POST',
            data: formData,
            success: function(response) {
                alert(response.message);
                // 페이지 리로드 없이 사용자 정보 업데이트
                updateDisplayedUserInfo();
                window.location.reload();
            },
            error: function(error) {
                alert('업데이트 실패: ' + error.responseText);
            }
        });
    });
});

function initializeDisplay(){
    const departmentSelect = $('#department');
    const positionSelect = $('#position');

    // 부서 정보를 가져와서 옵션 태그에 추가
    $.ajax({
        url: '/user/dept',
        method: 'GET',
        success: function(data) {
            data.forEach(function(department) {
                departmentSelect.append(new Option(department.departmentName, department.departmentId));
            });
        },
        error: function(error) {
            console.error('Error fetching departments:', error);
        }
    });

    // 포지션 정보를 가져와서 옵션 태그에 추가
    $.ajax({
        url: '/user/positions',
        method: 'GET',
        success: function(data) {
            data.forEach(function(position) {
                positionSelect.append(new Option(position.positionName, position.positionCode));
            });
        },
        error: function(error) {
            console.error('Error fetching positions:', error);
        }
    });
}

function updateDisplayedUserInfo() {
    const employeeCode = $('meta[name="employeeCode"]').attr('content');
    // 업데이트된 사용자 정보를 가져오기
    $.ajax({
        url: '/user/info', // 업데이트된 사용자 정보를 가져오는 엔드포인트
        data: { employeeCode: employeeCode },
        method: 'GET',
        success: function(user) {
            // 화면에 표시된 사용자 정보 업데이트
            $('#EmployeeCode').val(user.employeeCode);
            $('#name').val(user.name);
            $('#birth').val(user.birthDate);
            $('#address').val(user.address);
            $('#department').val(user.departmentName);
            $('#position').val(user.ps_cd);
            $('#userName').val(user.username);
            $('#password').val(user.password);
        },
        error: function(error) {
            console.error('Error fetching updated user info:', error);
        }
    });
}
