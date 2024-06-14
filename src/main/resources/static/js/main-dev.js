$(document).ready(function() {
    const employee_code = $('meta[name="employee-code"]').attr('content');

    // 공통 AJAX 유틸리티 함수
    function getAjaxData(url, method, data, successCallback, errorCallback) {
        $.ajax({
            url: url,
            type: method,
            data: data,
            dataType: 'json',
            success: successCallback,
            error: errorCallback
        });
    }

    // 성공 콜백 함수들
    function handleProjectListSuccess(projectList) {
        $('.paginationContainer').pagination({
            dataSource: projectList,
            pageSize: 3,
            callback: function (data, pagination) {
                renderProjectList(data);
            },
            error: function () {
                console.error('프로젝트 목록을 가져오는 중 오류 발생');
            }
        });
    }

    function handleFeedsSuccess(feeds) {
        let feedHtml = '';
        feeds.forEach(feed => {
            feedHtml += `
                <div class="activity-item d-flex align-items-start">
                    <div class="activity-info">
                        <h5 class="mb-0"><a href="#" class="text-dark">${feed.name}</a></h5>
                        <p class="mb-0">${feed.content}</p>
                        <span class="time">${feed.created_at}</span>
                    </div>
                </div>
            `;
        });
        $('.projectFeedContainer').html(feedHtml); // 피드 내용 업데이트
    }

    function handleProjectInfoSuccess(project) {
        const startDate = new Date(project.start_date);
        const endDate = new Date(project.end_date);
        const today = new Date();
        const timeDiff = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        let projectInfoHtml = `
            <p>${project.description}</p>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">시작일</h5>
                        <p class="text-dark mb-0">${startDate.toLocaleDateString()}</p> 
                    </div>
                </li>
                <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">종료일</h5>
                        <p class="text-dark mb-0">${endDate.toLocaleDateString()}</p> 
                    </div>
                </li>
      
            </ul>
        `;

        $('.projectInfoContainer').html(projectInfoHtml);
        console.log(project.description);
        let projectProgressHtml = `
            <div>
                <h3 class="display-5 fw-bold text-white mb-1">${diffDays} Days</h3>
                <<p class="mb-0 text-white">
                   Today : ${today.toLocaleDateString()}
                </p>>
            </div>
        `;
        $('.projectProgressContainer').html(projectProgressHtml); // 진행시간 및 오늘 날짜 업데이트

    }
    // 팀원 정보 가져오기 성공 콜백 함수
    function handleMembersSuccess(members) {
        let membersHtml = '';
        members.forEach(member => {
            membersHtml += `
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="ms-2">
                                <h5 class="mb-0"><a href="#" class="text-dark">${member.name}</a></h5>
                            </div>
                        </div>
                    </td>
            `;
        });
        $('.projectMemberList').html(membersHtml); // 팀원 목록 업데이트
    }
    // 프로젝트 목록 렌더링 함수
    function renderProjectList(data) {
        let html = '';
        $.each(data, function (index, item) {
            getAjaxData(`/projects/${item.project_id}/tasks`, 'GET', {}, function(tasks) {
                const completedTasks = tasks.filter(task => task.progress === 100); // 완료된 작업 필터링
                const totalTasks = tasks.length; // 총 작업 개수
                const progressPercentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0; // 진행률 계산
            html += `
                <tr data-project-id="${item.project_id}">
                    <td>${item.project_id}</td>
                    <td class="align-middle">
                        <div class="d-flex align-items-center">
                            <div class="ms-3 lh-1">
                                <h5 class="mb-1">${item.project_name}</h5> 
                            </div>
                        </div>
                    </td>
                    <td class="align-middle text-dark">
                       <div class="float-start me-3">
                            ${progressPercentage}% 
                        </div>
                       <div class="mt-2">
                            <div class="progress" style="height: 5px;">
                                <div class="progress-bar" role="progressbar" style="width: ${progressPercentage}%" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>`;
                // 모든 프로젝트의 진행률 계산이 완료된 후에 테이블 업데이트

                    $('.projectTableBody').html(html);

            }, function() {
                console.error('작업 목록을 가져오는 중 오류 발생');
            });
        });
        function handleModalSuccess(response) {
            console.log(response.info.description);
            const infos = response.info;
            const tasks = response.tasks;
            const members = response.members;

            let modalHtml = `
        <div class="modal-header">
            </div>
        <div class="modal-body">
            <div class="mb-3">
            <label for="project_name" class="form-label">프로젝트명</label>
            <input type="text" class="form-control" id="project_name" name="project_name" value="${infos.project_name}">
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">설명</label>
            <textarea class="form-control" id="description" name="description">${infos.description}</textarea>
        </div>
        <div class="mb-3">
            <label for="start_date" class="form-label">시작일</label>
            <input type="date" class="form-control" id="start_date" name="start_date" value="${infos.start_date}">
        </div>
        <div class="mb-3">
            <label for="end_date" class="form-label">종료일</label>
            <input type="date" class="form-control" id="end_date" name="end_date" value="${infos.end_date}">
        </div>
            
            <label class="form-label">팀원</label>
            <table class="table">
                <thead>
                    <tr>
                        <th>목록</th>
                    </tr>
                </thead>
                <tbody>
                    ${members.map(member => `
                            <td>${member.name}</td> 
                    `).join('')}
                </tbody>
            </table>
            <label class="form-label">담당 작업</label>
            <table class="table">
                <thead>
                    <tr>
                        <th>작업 내용</th>
                        <th>담당자</th>
                        <th>진행률</th>
                    </tr>
                </thead>
                <tbody>
            ${tasks.map(task => `
                <tr>
                    <td><input type="text" class="form-control taskContentInput" name="taskContents" value="${task.task_content}"></td>
                    <td>
                        <select class="form-select taskAssigneeSelect" name="taskAssignees">
                            ${members.map(member => `
                                <option value="${member.employee_code}" ${task.employee_code === member.employee_code ? 'selected' : ''}>${member.name}</option>
                            `).join('')}
                        </select>
                    </td>
                    <td><input type="number" class="form-control taskProgressInput" name="taskProgresses" value="${task.progress}" min="0" max="100"></td>
                    <td><button type="button" class="btn btn-danger btn-sm removeTaskRow">삭제</button></td>
                </tr>
            `).join('')}
            </tbody>
            </table>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button type="button" class="btn btn-primary" id="saveProjectChangesBtn" data-project-id="${infos.projectId}">수정</button> 
        </div>
    `;
            $('#editProjects').html(modalHtml);
            $('#editProjectsModal').modal('show'); // 모달 열기 (ID 수정)
        }

        function handleTasksSuccess(tasks) {
            let taskHtml = `
        <table class="table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>작업 내용</th>
                    <th>담당자</th>
                    <th>진행률</th>
                </tr>
            </thead>
            <tbody>
    `;
            tasks.forEach(task => {
                taskHtml += `
                <tr>
                    <td>${task.project_task_id}</td>
                    <td>${task.task_content}</td>
                    <td>${task.name}</td>
                    <td>
                        <div class="d-flex align-items-center"> 
                            <div class="progress" style="height: 5px; width: 80%;"> 
                                <div class="progress-bar" role="progressbar" style="width: ${task.progress}%" aria-valuenow="${task.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <span class="ms-2">${task.progress}%</span> 
                        </div>
                    </td>
                </tr>
            `;
            });
            $('.projectTaskContainer').html(taskHtml); // 담당 작업 정보 업데이트
        }

        // 프로젝트 행 클릭 시 피드 가져오기 (이벤트 위임)
        $('.projectTableBody').on('click', 'tr', function () {
            const projectId = $(this).data('projectId');
            console.log("projectId:", projectId); // 클릭된 프로젝트 ID 확인

            // 피드 가져오기
            // 피드 가져오기 (페이징 처리)
            getAjaxData(`/projects/${projectId}/feeds`, 'GET', {}, function(feedList) {
                $('.feedPaginationContainer').pagination({
                    dataSource: feedList,
                    pageSize: 5, // 페이지당 피드 개수
                    callback: function(data, pagination) {
                        handleFeedsSuccess(data); // 피드 렌더링 함수 호출
                    }
                });
            }, function() {
                console.error('피드를 가져오는 중 오류 발생');
            });

            // 프로젝트 정보 가져오기
            getAjaxData(`/projects/${projectId}/projectInfo`, 'GET', {}, handleProjectInfoSuccess, function (project) {
                console.error('프로젝트 정보를 가져오는 중 오류 발생');
            });
            // 팀원 정보 가져오기
            getAjaxData(`/projects/${projectId}/members`, 'GET', {}, handleMembersSuccess, function (members) {
                console.error('팀원 정보를 가져오는 중 오류 발생');
            });
            getAjaxData(`/projects/${projectId}/tasks`, 'GET', {}, handleTasksSuccess, function (tasks) {
                console.error('담당 작업 정보를 가져오는 중 오류 발생');
            });

            getAjaxData(`/projects/${projectId}/editProject`, 'GET', {}, function(response) { // response로 변경
                handleModalSuccess(response); // projectId 대신 response 전달
            }, function () {
                console.error('프로젝트 수정 정보를 가져오는 중 오류 발생');
            });
        });
    }

    // 초기 프로젝트 목록 가져오기
    getAjaxData('/projects/list', 'GET', {employeeCode: employee_code}, handleProjectListSuccess, function () {
        console.error('프로젝트 목록을 가져오는 중 오류 발생');
    });

});
