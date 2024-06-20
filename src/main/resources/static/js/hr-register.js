
// 등록 폼 처리


$(document).ready(function() {
    const departmentSelect = $('#department');
    const positionSelect = $('#position');

    // 초기 로드 시 경고 메시지 표시
    $('#departmentHelpBlock').show();
    $('#positionHelpBlock').show();

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

    // 부서 선택 변경 시 즉시 경고 메시지 처리
    departmentSelect.change(function() {
        if (departmentSelect.val() === '') {
            $('#departmentHelpBlock').show();
        } else {
            $('#departmentHelpBlock').hide();
        }
    });

    // 직급 선택 변경 시 즉시 경고 메시지 처리
    positionSelect.change(function() {
        if (positionSelect.val() === '') {
            $('#positionHelpBlock').show();
        } else {
            $('#positionHelpBlock').hide();
        }
    });

    $('#registerForm').on('submit', function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 방지

        let isValid = true;

        if (departmentSelect.val() === '') {
            $('#departmentHelpBlock').show();
            isValid = false;
        } else {
            $('#departmentHelpBlock').hide();
        }

        if (positionSelect.val() === '') {
            $('#positionHelpBlock').show();
            isValid = false;
        } else {
            $('#positionHelpBlock').hide();
        }

        if (!isValid) {
            return;
        }

        const formData = $(this).serialize(); // 폼 데이터를 직렬화

        $.ajax({
            url: '/user/register',
            method: 'POST',
            data: formData,
            success: function(response) {
                alert(response.message);
                window.location.href = '/hr/edit';
            },
            error: function(error) {
                alert('등록 실패: ' + error.responseText);
            }
        });
    });
});


// 업데이트 폼 처리

$(document).ready(function() {
    $('#updateForm').on('submit', function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 방지

        const formData = $(this).serialize(); // 폼 데이터를 직렬화

        $.ajax({
            url: '/user/update',
            method: 'POST',
            data: formData,
            success: function(response) {
                alert(response.message);
                location.href = '/hr/edit';
            },
            error: function(error) {
                alert('업데이트 실패: ' + error);
            }
        });
    });
});
