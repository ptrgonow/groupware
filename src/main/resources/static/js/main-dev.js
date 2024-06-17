$(document).ready(function() {
    const employee_code = $('meta[name="employee-code"]').attr('content');

    // 공통 AJAX 유틸리티 함수
    function getAjaxData({ url, method = 'GET', data = {}, dataType = 'json', contentType = 'application/json', successCallback, errorCallback }) {
        $.ajax({
            url: url,
            type: method,
            data: method === 'GET' ? data : JSON.stringify(data),
            dataType: dataType,
            contentType: contentType,
            success: successCallback,
            error: errorCallback
        });
    }

    // 성공 콜백 함수들
    function handleProjectListSuccess(projectList) {
        $('.paginationContainer').pagination({
            dataSource: projectList,
            pageSize: 3,
            callback: function(data, pagination) {
                renderProjectList(data);
            },
            error: function() {
                console.error('프로젝트 목록을 가져오는 중 오류 발생');
            }
        });
    }

    function handleFeedsSuccess(feeds) {
        let feedHtml = feeds.map(feed => `
            <div class="activity-item d-flex align-items-start">
                <div class="activity-info">
                    <h5 class="mb-0"><a href="#" class="text-dark">${feed.name}</a></h5>
                    <p class="mb-0">${feed.content}</p>
                    <span class="time">${feed.created_at}</span>
                </div>
            </div>
        `).join('');
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
                <p class="mb-0 text-white">Today : ${today.toLocaleDateString()}</p>
            </div>
        `;
        $('.projectProgressContainer').html(projectProgressHtml); // 진행시간 및 오늘 날짜 업데이트
    }

    function handleMembersSuccess(members) {
        let membersHtml = members.map(member => `
            <td>
                <div class="d-flex align-items-center">
                    <div class="ms-2">
                        <h5 class="mb-0"><a href="#" class="text-dark">${member.name}</a></h5>
                    </div>
                </div>
            </td>
        `).join('');
        $('.projectMemberList').html(membersHtml); // 팀원 목록 업데이트
    }

    function renderProjectList(data) {
        let html = '';
        data.forEach(item => {
            getAjaxData({
                url: `/projects/${item.project_id}/tasks`,
                successCallback: function(tasks) {
                    const completedTasks = tasks.filter(task => task.progress === 100);
                    const totalTasks = tasks.length;
                    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
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
                                <div class="float-start me-3">${progressPercentage}%</div>
                                <div class="mt-2">
                                    <div class="progress" style="height: 5px;">
                                        <div class="progress-bar" role="progressbar" style="width: ${progressPercentage}%" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                    $('.projectTableBody').html(html);
                },
                errorCallback: function() {
                    console.error('작업 목록을 가져오는 중 오류 발생');
                }
            });
        });
    }

    function handleModalSuccess(response, projectId) {
        const infos = response.info;
        const tasks = response.tasks;
        const members = response.members;
        let modalHtml = `
            <div class="modal-header"></div>
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
                    <tbody id="pj_members">
                        ${members.map(member => `<td data-employee-code="${member.employee_code}">${member.name}</td>`).join('')}
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
                <button type="button" class="btn btn-primary" id="saveProjectChangesBtn" data-project-id="${projectId}">수정</button>
            </div>
        `;
        $('#editProjects').html(modalHtml);
        $('#editProjectsModal').modal('show'); // 모달 열기

        $('#saveProjectChangesBtn').on('click', function() {
            const updatedProject = {
                project_id: projectId,
                project_name: $('#project_name').val(),
                description: $('#description').val(),
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val(),
                // 필요한 경우 status 추가
            };

            let formData = {
                project: updatedProject,
                members: [],
                tasks: []
            };

            $('#pj_members td').each(function (){
                formData.members.push({
                    employee_code: $(this).data('employee-code'),
                    name: $(this).text().trim()
                });
            });

            $('#editProjectsModal .taskContentInput').each(function(index) {
                formData.tasks.push({
                    task_content: $(this).val(),
                    employee_code: $(this).closest('tr').find('.taskAssigneeSelect').val(),
                    progress: $(this).closest('tr').find('.taskProgressInput').val()
                });
            });

            getAjaxData({
                url: '/projects/update',
                method: 'POST',
                data: formData,
                successCallback: function(response) {
                    if (response.status === 'success') {
                        alert('프로젝트가 성공적으로 수정되었습니다.');
                        $('#editProjectsModal').modal('hide');
                    } else {
                        alert('프로젝트 수정 중 오류가 발생했습니다: ' + response.message);
                    }
                },
                errorCallback: function(jqXHR, textStatus, errorThrown) {
                    console.error('프로젝트 수정 요청 중 오류 발생:', jqXHR.responseText);
                    alert('프로젝트 수정 중 오류가 발생했습니다: ' + (jqXHR.responseJSON?.message || '알 수 없는 오류'));
                }
            });
        });
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
        taskHtml += '</tbody></table>';
        $('.projectTaskContainer').html(taskHtml); // 담당 작업 정보 업데이트
    }

    // 프로젝트 행 클릭 시 피드 가져오기 (이벤트 위임)
    $('.projectTableBody').on('click', 'tr', function() {
        const projectId = $(this).data('projectId');
        console.log("projectId:", projectId); // 클릭된 프로젝트 ID 확인

        getAjaxData({
            url: `/projects/${projectId}/feeds`,
            successCallback: function(feedList) {
                $('.feedPaginationContainer').pagination({
                    dataSource: feedList,
                    pageSize: 5,
                    callback: function(data, pagination) {
                        handleFeedsSuccess(data); // 피드 렌더링 함수 호출
                    }
                });
            },
            errorCallback: function() {
                console.error('피드를 가져오는 중 오류 발생');
            }
        });

        getAjaxData({
            url: `/projects/${projectId}/projectInfo`,
            successCallback: handleProjectInfoSuccess,
            errorCallback: function() {
                console.error('프로젝트 정보를 가져오는 중 오류 발생');
            }
        });

        getAjaxData({
            url: `/projects/${projectId}/members`,
            successCallback: handleMembersSuccess,
            errorCallback: function() {
                console.error('팀원 정보를 가져오는 중 오류 발생');
            }
        });

        getAjaxData({
            url: `/projects/${projectId}/tasks`,
            successCallback: handleTasksSuccess,
            errorCallback: function() {
                console.error('담당 작업 정보를 가져오는 중 오류 발생');
            }
        });

        $(document).on('click', '.cocoBtn', function() {
            getAjaxData({
                url: `/projects/${projectId}/editProject`,
                successCallback: function(response) {
                    handleModalSuccess(response, projectId);
                },
                errorCallback: function() {
                    console.error('프로젝트 수정 정보를 가져오는 중 오류 발생');
                }
            });
        });
    });

    // 초기 프로젝트 목록 가져오기
    getAjaxData({
        url: '/projects/list',
        data: { employeeCode: employee_code },
        successCallback: handleProjectListSuccess,
        errorCallback: function() {
            console.error('프로젝트 목록을 가져오는 중 오류 발생');
        }
    });
});
