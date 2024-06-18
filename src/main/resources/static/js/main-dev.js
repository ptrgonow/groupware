$(document).ready(function() {

    // 페이지 로드 시 첫 번째 프로젝트 세부 정보 가져오기
    fetchFirstProjectDetails();

    // 프로젝트 목록에서 프로젝트 클릭 시 이벤트 처리
    $('.pr-tbl tbody tr').on('click', function() {
        const projectId = $(this).data('project-id');
        clearProjectDetails(); // 기존 정보 초기화
        fetchProjectDetails(projectId); // 선택된 프로젝트 정보 가져오기
    });

    $('#pr-edit-btn').on('click', function() {
        editProject();
    });

    // 작업 추가 버튼 클릭 시 이벤트 처리
    $('#add-task-btn').on('click', function() {
        addTaskRow();
    });

    // 작업 삭제 버튼 클릭 시 이벤트 처리
    $('#editPrModal').on('click', '.delete-btn', function() {
        $(this).closest('tr').remove();
    });

    // 프로젝트 수정 요청
    $('#edit-pr-btn').on('click', function() {
        submitEditProject();
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
        success: function(data) {
            displayProjectDetails(data);
            // 프로젝트 데이터 전역 변수에 저장
            window.currentProjectData = data;
        },
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
    const feeds = data.feeds;

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

    // 시작일부터 D + 구하기
    const startDate = new Date(project.startDate);
    const diffTime2 = Math.abs(today - startDate);
    const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
    $('.display-5.diff2').text(diffDays2 + ' Days');

    // 시작 날짜 표시
    $('.text-white.start').text('Start day : ' + new Date(project.startDate).toLocaleDateString());
    // 종료 날짜 표시
    $('.text-white.end').text('End day : ' + new Date(project.endDate).toLocaleDateString());

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
                <td>${task.taskEmployeeName}</td>
                <td>${task.taskContent}</td>
                <td>${task.taskProgress}%</td>
            </tr>
        `;
    });
    $('#pr-task-body').html(taskRows);

    // 피드 정보 표시
    let feedRows = '';
    feeds.forEach((feed, index) => {
        feedRows += `
            <tr>
                <td>${feed.name}</td>
                <td>${feed.content}</td>
                <td>${feed.createdAt}</td>
            </tr>
        `;
    });
    $('#pr-feed-body').html(feedRows);
}

// 프로젝트 세부 정보 초기화 함수
function clearProjectDetails() {
    $('#pr-detail-description').text('');
    $('.list-group-item:nth-child(1) .text-dark').text('');
    $('.list-group-item:nth-child(2) .text-dark').text('');
    $('.display-5.diff').text('');
    $('.text-white.today').text('');
    $('#pr-mem-body').html('');
    $('#pr-task-body').html('');
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

// 프로젝트 수정 모달 열기 함수
function editProject() {
    if (!window.currentProjectData) {
        displayErrorMessage('수정할 프로젝트 정보가 없습니다.');
        return;
    }

    const project = window.currentProjectData.project;
    const members = window.currentProjectData.members;
    const tasks = window.currentProjectData.tasks;

    // 모달 초기화
    $('#project_name').val('');
    $('#description').val('');
    $('#start_date').val('');
    $('#end_date').val('');
    $('#status').val('');
    $('#editPrModal table').first().find('tbody').html('');
    $('#editPrModal table').last().find('tbody').html('');

    // 프로젝트 수정 모달에 정보 설정
    $('#editPrModal').data({
        'project-id': project.projectId,
        'project-name': project.projectName,
        'project-description': project.description,
        'project-start-date': project.startDate,
        'project-end-date': project.endDate,
        'project-members': members,
        'project-tasks': tasks
    });

    // 모달의 입력 필드와 테이블에 데이터 설정
    $('#project_name').val(project.projectName);
    $('#description').val(project.description);
    $('#start_date').val(new Date(project.startDate).toISOString().split('T')[0]);
    $('#end_date').val(new Date(project.endDate).toISOString().split('T')[0]);
    $('#status').val(project.status);

    // 팀원 정보 설정
    let memberRows = '';
    members.forEach((member) => {
        memberRows += `
            <tr>
                <td>${member.memberName}</td>
                <input type="hidden" id="mCode" value="${member.memberId}">
                <input type="hidden" id="eCode" value="${member.memberEmployeeCode}">
            </tr>
        `;
    });
    $('#editPrModal table').first().find('tbody').html(memberRows);

    // 작업 정보 설정
    let taskRows = '';
    tasks.forEach((task) => {
        const memberOptions = members.map(member =>
            `<option value="${member.memberEmployeeCode}" ${member.memberEmployeeCode === task.taskEmployeeCode ? 'selected' : ''}>${member.memberName}</option>`
        ).join('');

        taskRows += `
            <tr>
                <td>
                    <input type="hidden" id="tCode" value="${task.taskId}">
                    <input type="text" id="taskContent" class="form-control taskContentInput" name="taskContents" value="${task.taskContent}">
                </td>
                <td>
                    <select class="form-select taskAssigneeSelect" name="taskAssignees">
                        <option value="">직원 선택</option>
                        ${memberOptions}
                    </select>
                </td>
                <td><input type="number" class="form-control taskProgressInput" name="taskProgresses" value="${task.taskProgress}" min="0" max="100"></td>
                <td><button type="button" class="btn btn-danger delete-btn">삭제</button></td>
            </tr>
        `;
    });
    $('#editPrModal table').last().find('tbody').html(taskRows);

    // 프로젝트 수정 모달 열기
    $('#editPrModal').modal('show');
}

// 작업 추가 행 추가 함수
function addTaskRow() {
    const members = window.currentProjectData.members;
    const memberOptions = members.map(member =>
        `<option value="${member.memberEmployeeCode}">${member.memberName}</option>`
    ).join('');

    const newRow = `
        <tr>
            <td>
                <input type="text" class="form-control taskContentInput" name="taskContents">
            </td>
            <td>
                <select class="form-select taskAssigneeSelect" name="taskAssignees">
                    <option value="">직원 선택</option>
                    ${memberOptions}
                </select>
            </td>
            <td><input type="number" class="form-control taskProgressInput" name="taskProgresses" min="0" max="100"></td>
            <td><button type="button" class="btn btn-danger delete-btn">삭제</button></td>
        </tr>
    `;
    $('#editPrModal table').last().find('tbody').append(newRow);
}

// 프로젝트 수정 요청 함수
function submitEditProject() {
    const projectId = $('#editPrModal').data('project-id');
    const projectName = $('#project_name').val();
    const description = $('#description').val();
    const startDate = $('#start_date').val();
    const endDate = $('#end_date').val();
    const status = $('#status').val();
    const departmentId = $('meta[name="departmentId"]').attr('content');
    console.log(departmentId);

    // 멤버 정보 가져오기
    const members = [];
    $('#editPrModal table').first().find('tbody tr').each(function(index, element) {
        const memberEmployeeCode = $(element).find('#eCode').val();
        const memberId = $(element).find('#mCode').val();
        members.push({
            memberId: memberId,
            memberEmployeeCode: memberEmployeeCode
        });
    });

    // 작업 정보 가져오기
    const tasks = [];
    $('#editPrModal table').last().find('tbody tr').each(function(index, element) {
        const taskId = $(element).find('#tCode').val();
        const taskContent = $(element).find('#taskContent').val();
        const taskEmployeeCode = $('.taskAssigneeSelect').eq(index).val();
        const taskProgress = $('.taskProgressInput').eq(index).val();

        tasks.push({
            taskId: taskId,
            taskContent: taskContent,
            taskEmployeeCode: taskEmployeeCode,
            taskProgress: taskProgress
        });
    });

    let projectDTO = {
        projectId: projectId,
        projectName: projectName,
        departmentId: departmentId,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: status
    };

    let formData = {
        projectDTO: projectDTO,
        members: members,
        tasks: tasks
    };

    console.log("Data to be sent:", formData); // 데이터 확인용 로깅

    // AJAX 요청 보내기
    $.ajax({
        type: "POST",
        url: "/pr/edit",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function(response) {
            alert("프로젝트가 수정되었습니다.");
            $('#editPrModal').modal('hide');
            fetchProjectDetails(projectId); // 수정된 프로젝트 정보 다시 가져오기
            window.location.reload();
        },
        error: function(error) {
            console.error('프로젝트 수정 오류:', error);
            displayErrorMessage('프로젝트 수정 중 오류가 발생했습니다.');
        }
    });
}
