const itemsPerPage = 5; // 페이지당 표시할 항목 수
let currentProjectPage = 1;
let currentMemberPage = 1;
let currentTaskPage = 1;
let currentFeedPage = 1;
let projectsArray = [];
let deletedMembers = [];
let selectedProjectId = null;

$(document).ready(function() {

    initializeProjectsArray();
    initializeProjectPagination();
    setInitialProjectDetails();

    // 이벤트 핸들러 설정
    $(document).on('click', '.pr-tbl tbody tr', handleProjectRowClick);
    $('#pr-edit-btn').on('click', editProject);
    $('#add-task-btn').on('click', addTaskRow);
    $(document).on('click', '#editPrModal #delete-task-btn', deleteTask);
    $('#edit-pr-btn').on('click', submitEditProject);
    $('#feed-form-group').on('submit', handleFeedFormSubmit);
    $('#git-tab').on('shown.bs.tab', fetchWebhookData);
    $('#toggle-mem').on('click', fetchTeamMembers);
    $('#member-list').on('click', '.delete-team-member', deleteTeamMember);
    $(document).on('click', '.select-member-btn', selectTeamMember);
    $(document).on('change', 'input[name="pr-radio"]', function() {
        selectedProjectId = $(this).closest('tr').data('project-id');
    });
    $('#pr-delete-btn').on('click', deleteProject);

});

// 팀원 목록을 가져오는 함수 = 두번쨰 모달에서 표시할 팀원 목록
function fetchTeamMembers() {
    $.ajax({
        url: '/pr/mem/list', // 팀원 목록을 가져오는 API 엔드포인트
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#team-member-list').empty();
            let memberRows = '';
            data.members.forEach(function(member) {
                memberRows += `
                    <tr>
                        <td>${member.employeeName}</td>
                        <td>${member.departmentName}</td>
                        <td>${member.positionName}</td>
                        <td>
                        <button type="button" class="btn-info select-member-btn" 
                            data-employee-code="${member.employeeCode}"
                            data-name="${member.employeeName}"
                            data-department="${member.departmentName}"
                            data-position="${member.positionName}">선택</button>
                        </td>
                        
                    </tr>
                `;
            });
            $('#team-member-list').html(memberRows);
            $('#addMemberModal').modal('show');
        },
        error: function(error) {
            console.error('팀원 목록을 가져오는 중 오류 발생:', error);
        }
    });
}

// 팀원을 선택하는 함수
function selectTeamMember() {
    var name = $(this).data('name');
    var department = $(this).data('department');
    var position = $(this).data('position');
    var employeeCode = $(this).data('employee-code');

    // 팀원 목록에 추가
    $('#member-list').append(`
        <tr>
            <td>${name}</td>
            <td>${department}</td>
            <td>${position}</td>
            <td class="delete-team-member">@</td>
            <input type="hidden" id="eCode" value="${employeeCode}">
        </tr>
    `);

    // 팀원 추가 모달 닫기
    $('#addMemberModal').modal('hide');
}

// AJAX 요청을 보내어 웹훅 데이터를 가져오는 함수
function fetchWebhookData() {
    $.ajax({
        url: 'https://impala-intent-rarely.ngrok-free.app/github-webhook/data',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let htmlContent = formatJsonToHtml(data);
            $('#pr-git-hook').html(htmlContent);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#pr-git-hook').text('Error fetching data');
        }
    });
}

function formatJsonToHtml(jsonData) {
    let html = '';

    // 필요한 데이터 추출 및 HTML 포맷팅
    if (jsonData.length > 0) {
        jsonData.forEach(item => {
            let payload = JSON.parse(item.payload);
            if (payload.commits && payload.commits.length > 0) {
                payload.commits.forEach(commit => {
                    html += `
                       <div class="commit">
                            <div class="commit-header">
                                <img src="https://avatars.githubusercontent.com/${commit.author.username}" alt="${commit.author.username}" class="avatar">
                                <span class="commit-name">${commit.author.username}</span> <span class="commit-message">${commit.message}</span>
                                <div class="commit-details text-right">
                                    <a href="${commit.url}" target="_blank">커밋 확인</a>
                                </div>
                            </div>
                        </div>
                    <hr>`;
                });
            }
        });
    } else {
        html = '<p>No commits available.</p>';
    }

    return html;
}

function initializeProjectsArray() {
    $('#project_table_body tr').each(function() {
        const project = {
            projectId: $(this).data('project-id'),
            projectName: $(this).find('td:nth-child(2)').text(),
            status: $(this).find('td:nth-child(3)').text()
        };
        projectsArray.push(project);
    });
}

function initializeProjectPagination() {
    $('#project-pagination').pagination({
        dataSource: projectsArray,
        pageSize: itemsPerPage,
        pageNumber: currentProjectPage,
        callback: function(data, pagination) {
            currentProjectPage = pagination.pageNumber;
            displayPaginatedProjects(currentProjectPage);
        }
    });
}

function setInitialProjectDetails() {
    displayPaginatedProjects(currentProjectPage);
    if (projectsArray.length > 0) {
        fetchProjectDetails(projectsArray[0].projectId);
    } else {
        displayNoProjectMessage();
    }
}

function handleProjectRowClick() {
    const projectId = $(this).data('project-id');
    clearProjectDetails();
    fetchProjectDetails(projectId);
}

function displayPaginatedProjects(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedProjects = projectsArray.slice(startIndex, startIndex + itemsPerPage);

    let projectRows = '';
    paginatedProjects.forEach((project, index) => {
        projectRows += `
            <tr data-project-id="${project.projectId}">
                <td><input type="radio" class="pr-radio" name="pr-radio"></td>
                <td>${startIndex + index + 1}</td>
                <td>${project.projectName}</td>
                <td>${project.status}</td>
            </tr>
        `;
    });
    $('#project_table_body').html(projectRows);
}

function fetchProjectDetails(projectId) {
    $.ajax({
        url: '/pr/details',
        method: 'GET',
        data: { projectId: projectId },
        dataType: 'json',
        success: function(data) {
            clearProjectDetails(); // 기존 데이터를 지움
            displayProjectDetails(data);
            window.currentProjectData = data; // 프로젝트 데이터 전역 변수에 저장
        },
        error: function(xhr, status, error) {
            console.error('프로젝트 세부 정보 가져오기 오류:', error);
            displayErrorMessage('프로젝트 세부 정보를 가져오는 중 오류가 발생했습니다.');
        }
    });
}

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
    const diffDays = Math.ceil(Math.abs(endDate - today) / (1000 * 60 * 60 * 24));
    $('.display-5.diff').text(diffDays + ' Days');

    // 시작일부터 D + 구하기
    const startDate = new Date(project.startDate);
    const diffDays2 = Math.ceil(Math.abs(today - startDate) / (1000 * 60 * 60 * 24));
    $('.display-5.diff2').text(diffDays2 + ' Days');

    // 시작 날짜 표시
    $('.text-white.start').text('Start day : ' + new Date(project.startDate).toLocaleDateString());
    // 종료 날짜 표시
    $('.text-white.end').text('End day : ' + new Date(project.endDate).toLocaleDateString());

    // 멤버, 작업, 피드 정보 페이징 처리
    displayPaginatedMembers(members, currentMemberPage);
    initializePagination('#pr-mem-pagination', members, currentMemberPage, displayPaginatedMembers);

    displayPaginatedTasks(tasks, currentTaskPage);
    initializePagination('#pr-task-pagination', tasks, currentTaskPage, displayPaginatedTasks);

    displayPaginatedFeeds(feeds, currentFeedPage);
    initializePagination('#pr-feed-pagination', feeds, currentFeedPage, displayPaginatedFeeds);
}

function initializePagination(paginationSelector, dataSource, currentPage, callback) {
    $(paginationSelector).pagination({
        dataSource: dataSource,
        pageSize: itemsPerPage,
        pageNumber: currentPage,
        callback: function(data, pagination) {
            currentPage = pagination.pageNumber;
            callback(dataSource, currentPage);
        }
    });
}

function displayPaginatedMembers(members, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedMembers = members.slice(startIndex, startIndex + itemsPerPage);

    let memberRows = '';
    paginatedMembers.forEach((member, index) => {
        memberRows += `
            <tr>
                <td>${startIndex + index + 1}</td>
                <td>${member.memberName}</td>
                <td>${member.memberDepartmentName}</td>
                <td>${member.memberPosition}</td>
            </tr>
        `;
    });
    $('#pr-mem-body').html(memberRows);
}

function displayPaginatedTasks(tasks, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedTasks = tasks.slice(startIndex, startIndex + itemsPerPage);

    let taskRows = '';
    paginatedTasks.forEach((task, index) => {
        taskRows += `
            <tr>
                <td>${task.taskContent}</td>
                <td>${task.taskEmployeeName}</td>
                <td>${task.taskProgress}%</td>
            </tr>
        `;
    });
    $('#pr-task-body').html(taskRows);
}

function displayPaginatedFeeds(feeds, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedFeeds = feeds.slice(startIndex, startIndex + itemsPerPage);

    let feedRows = '';
    paginatedFeeds.forEach((feed, index) => {
        feedRows += `
            <tr>
                <td>${feed.name}</td>
                <td>${feed.content}</td>
            </tr>
        `;
    });
    $('#pr-feed-body').html(feedRows);
}

function clearProjectDetails() {
    $('#pr-detail-description').empty(); // 기존 프로젝트 설명 초기화
    $('.list-group-item:nth-child(1) .text-dark').empty(); // 시작일 초기화
    $('.list-group-item:nth-child(2) .text-dark').empty(); // 종료일 초기화
    $('.display-5.diff').empty(); // 남은 일수 초기화
    $('.display-5.diff2').empty(); // 진행일수 초기화
    $('.text-white.start').empty(); // 시작 날짜 초기화
    $('.text-white.end').empty(); // 종료 날짜 초기화
    $('#pr-mem-body').empty(); // 멤버 목록 초기화
    $('#pr-task-body').empty(); // 작업 목록 초기화

}

function displayNoProjectMessage() {
    $('#pr-detail-description').text('등록된 프로젝트가 없습니다.');
    clearProjectDetails(); // 프로젝트 정보 초기화
}

function displayErrorMessage(message) {
    alert(message);
}

// 프로젝트 수정 모달 열기 함수에서 기존 멤버와 새 멤버를 모두 처리하도록 수정
function editProject() {
    if (!window.currentProjectData) {
        displayErrorMessage('수정할 프로젝트 정보가 없습니다.');
        return;
    }

    const project = window.currentProjectData.project;
    const members = window.currentProjectData.members;
    const tasks = window.currentProjectData.tasks;

    // 모달 초기화
    $('#project_name').val(project.projectName);
    $('#description').val(project.description);
    $('#start_date').val(new Date(project.startDate).toISOString().split('T')[0]);
    $('#end_date').val(new Date(project.endDate).toISOString().split('T')[0]);
    $('#status').val(project.status);

    $('#editPrModal').data('project-id', project.projectId);

    // 팀원 정보 설정
    let memberRows = '';
    members.forEach((member) => {
        memberRows += `
            <tr>
                <td>${member.memberName}</td>
                <td>${member.memberDepartmentName}</td>
                <td>${member.memberPosition}</td>
                <td class="delete-team-member">@</td>
                <input type="hidden" id="mCode" value="${member.memberId}">
                <input type="hidden" id="eCode" value="${member.memberEmployeeCode}">
            </tr>
        `;
    });
    $('#member-list').html(memberRows);

    // 작업 정보 설정
    let taskRows = '';
    tasks.forEach((task) => {
        const memberOptions = members.map(member =>
            `<option value="${member.memberEmployeeCode}" ${member.memberEmployeeCode === task.taskEmployeeCode ? 'selected' : ''}>${member.memberName}</option>`
        ).join('');

        taskRows += `
            <tr>
                <td class="col-t1">
                    <input type="hidden" id="tCode" value="${task.taskId}">
                    <input type="text" id="taskContent" class="form-control taskContentInput" name="taskContents" value="${task.taskContent}">
                </td>
                <td class="col-t2">
                    <select class="form-select taskAssigneeSelect" name="taskAssignees">
                        <option value="">직원 선택</option>
                        ${memberOptions}
                    </select>
                </td>
                <td class="col-t3"><input type="number" class="form-control taskProgressInput" name="taskProgresses" value="${task.taskProgress}" min="0" max="100"></td>
                <td class="col-t4"><button type="button" class="btn btn-danger delete-btn">삭제</button></td>
            </tr>
        `;
    });
    $('#editPrModal table').last().find('tbody').html(taskRows);

    // 프로젝트 수정 모달 열기
    $('#editPrModal').modal('show');
}

function addTaskRow() {
    const members = window.currentProjectData.members;
    const tasks = window.currentProjectData.tasks;
    const memberOptions = members.map(member =>
        `<option value="${member.memberEmployeeCode}">${member.memberName}</option>`
    ).join('');

    const newRow = `
        <tr>
            <td class="col-t1">
                <input type="text" id="taskContent" class="form-control taskContentInput" name="taskContents">
                <input type="hidden" id="tCode" value="${tasks.taskId}">
            </td>
            <td class="col-t2">
                <select class="form-select taskAssigneeSelect" id="taskAssignees" name="taskAssignees">
                    <option value="">직원 선택</option>
                    ${memberOptions}
                </select>
            </td>
            <td class="col-t3"><input type="number" class="form-control taskProgressInput" id="taskProgresses" name="taskProgresses" min="0" max="100"></td>
            <td class="col-t4"><button type="button" class="btn-info insert-task-btn">등록</button></td>
        </tr>
    `;

    const $tbody = $('#editPrModal table').last().find('tbody');

    $tbody.append(newRow);

    // 새로 추가된 등록 버튼에 이벤트 핸들러를 바인딩
    $tbody.find('.insert-task-btn').last().on('click', insertTask);

    // 새로 추가된 행의 첫 번째 입력 필드로 포커스 이동
    $tbody.find('tr').last().find('.taskContentInput').focus();
}

function submitEditProject() {
    const projectId = $('#editPrModal').data('project-id');
    const projectName = $('#project_name').val();
    const description = $('#description').val();
    const startDate = $('#start_date').val();
    const endDate = $('#end_date').val();
    const status = $('#status').val();
    const departmentId = $('meta[name="departmentId"]').attr('content');

    // 멤버 정보 가져오기
    const members = [];
    $('#member-list tr').each(function(index, element) {
        let memberEmployeeCode = $(element).find('#eCode').val();
        let memberId = $(element).find('#mCode').val();

        // memberId가 null인 경우 0으로 설정
        if (memberId == null || memberId === "") {
            memberId = 0;
        }

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

    const projectDTO = {
        projectId: projectId,
        projectName: projectName,
        departmentId: departmentId,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: status
    };

    const formData = {
        projectDTO: projectDTO,
        members: members,
        tasks: tasks,
        deletedMembers: deletedMembers
    };

    console.log("Data to be sent:", formData); // 데이터 확인용 로깅

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

function handleFeedFormSubmit(event) {
    event.preventDefault();
    addFeed();
}

function addFeed() {
    const employeeCode = $('meta[name="employeeCode"]').attr('content');
    const projectId = window.currentProjectData.project.projectId;
    const content = $('#pr-feed').val().trim();
    const projectFeedDTO = {
        content: content,
        employeeCode: employeeCode,
        projectId: projectId
    };

    $.ajax({
        url: '/pr/feed/add',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(projectFeedDTO),
        success: function(data) {
            if (data === '피드가 추가되었습니다.') {
                alert('피드가 추가되었습니다.');
                $('#pr-feed').val('');
                fetchProjectDetails(projectId);
            } else {
                alert('피드를 추가하는데 실패했습니다.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('피드를 추가하는데 실패했습니다.');
        }
    });
}

function insertTask() {
    const projectId = window.currentProjectData.project.projectId;
    const taskContent = $(this).closest('tr').find('.taskContentInput').val();
    const taskEmployeeCode = $(this).closest('tr').find('.taskAssigneeSelect').val();
    const taskProgress = $(this).closest('tr').find('.taskProgressInput').val();

    const ProjectTaskDTO = {
        projectId: projectId,
        taskContent: taskContent,
        taskEmployeeCode: taskEmployeeCode,
        taskProgress: taskProgress
    };

    console.log(ProjectTaskDTO);

    $.ajax({
        url: '/pr/task/add',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(ProjectTaskDTO),
        success: function(data) {
            if (data === '작업이 추가되었습니다.') {
                alert('작업이 추가되었습니다.');
                $('#editPrModal').modal('hide');
                fetchProjectDetails(projectId);
            } else {
                alert('작업을 추가하는데 실패했습니다.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('작업을 추가하는데 실패했습니다.');
        }
    });
}

function deleteTask() {
    const taskId = $(this).closest('tr').find('#tCode').val();
    const projectId = window.currentProjectData.project.projectId;

    $.ajax({
        url: '/pr/task/delete',
        type: 'POST',
        data: { taskId: taskId },
        success: function(data) {
            alert('작업이 삭제되었습니다.');
            $('#editPrModal').modal('hide');
            fetchProjectDetails(projectId);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('작업을 삭제하는데 실패했습니다.');
        }
    });
}

function deleteProject() {

    const selectedProjectId = $('input[name="pr-radio"]:checked').closest('tr').data('project-id');

    if (!selectedProjectId) {
        alert('삭제할 프로젝트를 선택해주세요.');
        return;
    }

    // 사용자에게 확인 메시지를 표시
    const confirmation = confirm('정말로 이 프로젝트를 삭제하시겠습니까?');
    if (!confirmation) {
        return;
    }

    // 서버로 삭제 요청을 보냄
    $.ajax({
        url: `/pr/delete/${selectedProjectId}`,
        method: 'POST',
        contentType: 'application/json',
        success: function(response) {
            if (response === '프로젝트가 삭제되었습니다.') {
                alert('프로젝트가 삭제되었습니다.');
                location.reload();
            } else {
                alert('프로젝트 삭제에 실패했습니다.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('프로젝트 삭제 중 오류가 발생했습니다.');
        }
    });
}


function deleteTeamMember() {
    const memberId = $(this).closest('tr').find('#mCode').val();
    if (memberId) {
        deletedMembers.push(memberId); // 삭제된 팀원의 ID를 배열에 추가
    }
    $(this).closest('tr').remove();
}
