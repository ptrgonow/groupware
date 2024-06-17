$(document).ready(function() {
    // 페이지 로드 시 첫 번째 프로젝트 세부 정보 가져오기
    fetchFirstProjectDetails();

    // 프로젝트 목록에서 프로젝트 클릭 시 이벤트 처리
    $('.pr-tbl tbody tr').on('click', function() {
        const projectId = $(this).data('project-id');
        clearProjectDetails(); // 기존 정보 초기화
        fetchProjectDetails(projectId); // 선택된 프로젝트 정보 가져오기
    });
});

// 첫 번째 프로젝트 세부 정보 가져오는 함수
function fetchFirstProjectDetails() {
    $.ajax({
        url: '/pr/list',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.length > 0) {
                fetchProjectDetails(data[0].projectId); // 첫 번째 프로젝트 정보 가져오기
            } else {
                displayNoProjectMessage(); // 프로젝트 없을 때 메시지 표시
            }
        },
        error: function(xhr, status, error) {
            console.error('프로젝트 목록 가져오기 오류:', error);
            displayErrorMessage('프로젝트 목록을 가져오는 중 오류가 발생했습니다.');
        }
    });
}

// 프로젝트 세부 정보 가져오는 함수
function fetchProjectDetails(projectId) {
    $.ajax({
        url: '/pr/details',
        method: 'GET',
        data: { projectId: projectId },
        dataType: 'json',
        success: displayProjectDetails, // 성공 시 정보 표시 함수 호출
        error: function(xhr, status, error) {
            console.error('프로젝트 세부 정보 가져오기 오류:', error);
            displayErrorMessage('프로젝트 세부 정보를 가져오는 중 오류가 발생했습니다.');
        }
    });
}

// 프로젝트 세부 정보 표시 함수
function displayProjectDetails(data) {
    const project = data.project;
    const members = data.members;
    const tasks = data.tasks;

    // 프로젝트 정보 표시
    $('#pr-detail-description').text(project.description);
    $('.list-group-item:nth-child(1) .text-dark').text(new Date(project.startDate).toLocaleDateString());
    $('.list-group-item:nth-child(2) .text-dark').text(new Date(project.endDate).toLocaleDateString());

    // 남은 일수 계산 및 표시
    const today = new Date();
    const endDate = new Date(project.endDate);
    const diffTime = Math.abs(endDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    $('.display-5.diff').text(diffDays + ' Days');

    // 오늘 날짜 표시
    $('.text-white.today').text('Today : ' + new Date().toLocaleDateString());

    // 멤버 정보 표시
    let memberRows = '';
    members.forEach((member, index) => {
        memberRows += `
            <tr>
                <td>${index + 1}</td>
                <td>${member.memberName}</td>
                <td>${member.memberDepartmentName}</td>
                <td>${member.memberPosition}</td>
            </tr>
        `;
    });
    $('#pr-mem-body').html(memberRows);

    // 작업 정보 표시
    let taskRows = '';
    tasks.forEach((task, index) => {
        taskRows += `
            <tr>
                <td>${index + 1}</td>
                <td>${task.taskContent}</td>
                <td>${task.taskEmployeeName}</td>
                <td>${task.taskProgress}%</td>
                <td>
                    <button type="button" class="btn btn-danger">삭제</button>
                </td>
            </tr>
        `;
    });
    $('.card-body.task').html(taskRows);
}

// 프로젝트 세부 정보 초기화 함수
function clearProjectDetails() {
    $('#pr-detail-description').text('');
    $('.list-group-item:nth-child(1) .text-dark').text('');
    $('.list-group-item:nth-child(2) .text-dark').text('');
    $('.display-5.diff').text('');
    $('.text-white.today').text('');
    $('#pr-mem-body').html('');
    $('.card-body.task').html('');
}

// 프로젝트 없을 때 메시지 표시 함수
function displayNoProjectMessage() {
    $('#pr-detail-description').text('등록된 프로젝트가 없습니다.');
    clearProjectDetails(); // 프로젝트 정보 초기화
}

// 오류 메시지 표시 함수
function displayErrorMessage(message) {
    alert(message);
}
