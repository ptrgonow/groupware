$(document).ready(function() {
    $.ajax({
        url: '/dev/projects', // 프로젝트 목록을 가져올 엔드포인트 URL
        type: 'GET',
        dataType: 'json',
        success: function(projectList) {
            $('#paginationContainer').pagination({
                dataSource: projectList,
                pageSize: 3,
                callback: function(data, pagination) {
                    let html = '';
                    $.each(data, function(index, item) {
                        html += `
                            <tr>
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
                }
            });
        },
        error: function() {
            console.error('프로젝트 목록을 가져오는 중 오류 발생');
        }
    });
});
