function submitLogout() {
    fetch('/user/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: ''
    })
        .then(response => {
            if ( response.ok ) {
                alert('로그아웃 성공');
                window.location.href = '/loginPage';
            } else if ( response.status === 401 ) { // Unauthorized status
                alert('로그인 해주세요');
                window.location.href = '/loginPage'; // Redirect to login page
            } else {
                alert('로그아웃 실패');
            }
        })
        .catch(error => console.error('Error:', error));
}


    function navigateToWorkPage() {
    // 서버에 요청하여 사용자 부서 정보를 가져옴
    fetch('/user/dInfo')  // 서버에서 부서 정보를 제공하는 API 엔드포인트
        .then(response => {
            if ( !response.ok ) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const departmentId = data.departmentId;

            // 부서별 메인 업무 페이지 URL을 설정
            let departmentMainPageUrl = null;

            switch (departmentId) {
                case 1:
                    departmentMainPageUrl = '/ceo';
                    break;
                case 2:
                    departmentMainPageUrl = '/pm';
                    break;
                case 3:
                    departmentMainPageUrl = '/ms';
                    break;
                case 4:
                    departmentMainPageUrl = '/dev';
                    break;
                case 5:
                    departmentMainPageUrl = '/dev';
                    break;
                case 6:
                    departmentMainPageUrl = '/dev';
                    break;
                case 7:
                    departmentMainPageUrl = '/dev';
                    break;
                case 8:
                    departmentMainPageUrl = '/dev';
                    break;
                case 9:
                    departmentMainPageUrl = '/hr';
                    break;
                case 10:
                    departmentMainPageUrl = '/fi';
                    break;
                default:
                    departmentMainPageUrl = '/';
                    break;
            }

            // 해당 URL로 리디렉션
            window.location.href = departmentMainPageUrl;
        })
        .catch(error => {
            console.error('Error fetching department info:', error);
            alert('부서 정보를 가져오는 데 실패했습니다. 다시 시도해 주세요.');
        });
}

