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
function sample6_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("extraAddress").value = extraAddr;

            } else {
                document.getElementById("extraAddress").value = '';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('address_postal').value = data.zonecode;
            document.getElementById("address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
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
