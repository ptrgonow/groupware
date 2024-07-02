$(document).ready(function() {

    initializeDisplay();
    updateDisplayedUserInfo();

    // $('#registerForm').on('submit', function(event) {
    //     event.preventDefault(); // 폼의 기본 제출 동작을 방지
    //
    //     const formData = $(this).serialize(); // 폼 데이터를 직렬화
    //     const address = $('#address_postal').val();
    //
    //     if(!address){
    //         alert('주소를 입력하세요')
    //         return;
    //     }
    //
    //     $.ajax({
    //         url: '/user/register',
    //         method: 'POST',
    //         data: formData,
    //         success: function(response) {
    //             alert(response.message);
    //             // UI 업데이트가 필요하다면 여기에서 처리
    //             window.location.href = '/hr/edit';
    //         },
    //         error: function(error) {
    //             const response = JSON.parse(error.responseText); // JSON 응답을 객체로 변환
    //             alert(response.message); // 메시지만 표시
    //
    //             if (response.message === '이미 존재하는 사원번호입니다.') {
    //                 $('#EmployeeCode').val('');
    //             }
    //
    //             if (response.message === '이미 존재하는 아이디입니다.') {
    //                 $('#userName').val('');
    //             }
    //         }
    //     });
    // });

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
function sample6_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 각 주소의 노출 규칙에 따라 주소를 조합
            // 공백 기준으로 분기
            var addr = ''; // 주소
            var extraAddr = ''; // 참고항목

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져옴
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합
            if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가(법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝남
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 생성
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
                document.getElementById("extraAddress").value = extraAddr;

            } else {
                document.getElementById("extraAddress").value = '';
            }

            document.getElementById('address_postal').value = data.zonecode;
            document.getElementById("address").value = addr;
            document.getElementById("detailAddress").focus();
        }

    }).open();
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
            $('#detailAddress').val(user.detailAddress);
            $('#extraAddress').val(user.extraAddress);
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
