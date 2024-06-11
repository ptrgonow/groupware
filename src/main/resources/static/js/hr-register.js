$(document).ready(function() {
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
});

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
                location.href = '/';
            },
            error: function(error) {
                alert('업데이트 실패: ' + error);
            }
        });
    });
});
