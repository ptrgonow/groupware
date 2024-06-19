document.addEventListener("DOMContentLoaded", function() {
    const pageSize = 6;

    // 프로젝트 테이블 페이징 처리
    const projectTableBody = document.querySelector('#project_table_body');
    const projectTableRows = Array.from(projectTableBody.querySelectorAll('tr'));
    const projects = [];
    projectTableRows.forEach(function(row) {
        var project = {
            index: row.cells[0].innerText.trim(),
            projectName: row.cells[1].innerText.trim(),
            status: row.cells[2].innerText.trim(),
        };
        projects.push(project);
    });

    $('#pagination-container').pagination({
        dataSource: projects,
        pageSize: pageSize,
        callback: function(data, pagination) {
            var html = renderProjectTable(data);
            $('#project_table_body').html(html);
        }
    });

    // 프로젝트 테이블 렌더링 함수
    function renderProjectTable(data) {
        var html = '';
        data.forEach(function(item, index) {
            html += `<tr>
                        <td>${index + 1}</td>
                        <td>${item.projectName}</td>
                        <td>${item.status}</td>
                    </tr>`;
        });
        return html;
    }
});
