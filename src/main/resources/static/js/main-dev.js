$(document).ready(function() {

    const employee_code = $('meta[name="employee-code"]').attr('content');

    $.ajax({
        url: '/projects/list', // 프로젝트 목록을 가져올 엔드포인트 URL
        type: 'GET',
        data: {employeeCode: employee_code},
        dataType: 'json',
        success: function (projectList) {
            $('#paginationContainer').pagination({
                dataSource: projectList,
                pageSize: 3,
                callback: function (data, pagination) {
                    let html = '';
                    $.each(data, function (index, item) {
                        html += `
                           <tr data-project-id="${item.project_id}">
                                <td>${item.project_id}</td>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <div class="icon-shape icon-md border p-4 rounded-1">
                                                <img src="${item.projectLogoUrl || ''}" alt="project logo1"> 
                                            </div>
                                        </div>
                                        <div class="ms-3 lh-1">
                                            <h5 class="mb-1">${item.project_name}</h5> 
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle text-dark">
                                    <div class="float-start me-3">
                                        ${item.status === "진행중" ? '35%' : '100%'} 
                                    </div>
                                    <div class="mt-2">
                                        <div class="progress" style="height: 5px;">
                                            <div class="progress-bar" role="progressbar" style="width:${item.status === "진행중" ? '35%' : '100%'}" aria-valuenow="${item.status === "진행중" ? '35' : '100'}" aria-valuemin="0" aria-valuemax="100">
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>`;
                    });
                    $('#projectTableBody').html(html);
                    // 프로젝트 행 클릭 시 피드 가져오기 (이벤트 위임)
                    $('#projectTableBody').on('click', 'tr', function () {
                        const projectId = $(this).data('projectId');
                        console.log("projectId:", projectId); // 클릭된 프로젝트 ID 확인

                        // 피드 가져오기
                        $.ajax({
                            url: `/projects/${projectId}/feeds`,
                            type: 'GET',
                            dataType: 'json',
                            success: function (feeds) {
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
                                $('#projectFeedContainer').html(feedHtml); // 피드 내용 업데이트
                            },
                            error: function () {
                                console.error('피드를 가져오는 중 오류 발생');
                            }
                        });
                        // 프로젝트 정보 가져오기
                        $.ajax({
                            url: `/projects/${projectId}/projectInfo`,
                            type: 'GET',
                            dataType: 'json',
                            success: function (project) {
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
                                <li class="list-group-item">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <h5 class="mb-0">진행시간</h5>
                                        <p class="text-dark mb-0">${diffDays}일</p>
                                    </div>
                                </li>
                            </ul>
                        `;

                                $('#projectInfoContainer').html(projectInfoHtml);
                                console.log(project.description);
                            },
                            error: function () {
                                console.error('프로젝트 정보를 가져오는 중 오류 발생');
                            }
                        });
                    });
                },
                error: function () {
                    console.error('프로젝트 목록을 가져오는 중 오류 발생');
                }
            });
        }
    });
});