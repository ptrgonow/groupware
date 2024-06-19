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
    // 회의 테이블 데이터 가져오기
    const meetings = [];
    document.querySelectorAll('#meetings-table tbody tr').forEach(row => {
        meetings.push({
            index: row.cells[0].innerText.trim(), // index 추가
            meetingTitle: row.cells[1].innerText.trim(),
            formattedSchedule: row.cells[2].innerText.trim()
        });
    });

    // 페이징 처리 (회의 테이블)
    $('#meetings-pagination-container').pagination({
        dataSource: meetings,
        pageSize: pageSize,
        callback: function(data, pagination) {
            // 페이지 변경 시 테이블 내용 업데이트
            $('#meetings-table tbody').empty();
            data.forEach((meeting, index) => { // index 추가
                $('#meetings-table tbody').append(`
                    <tr>
                        <td>${(pagination.pageNumber - 1) * pageSize + index + 1}</td> // 페이지 번호 고려
                        <td>${meeting.meetingTitle}</td>
                        <td>${meeting.formattedSchedule}</td>
                    </tr>
                `);
            });
        }
    });
    const addMeetingForm = document.getElementById('addMeetingForm');
    addMeetingForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        const formData = new FormData(addMeetingForm);
        const meetingData = {
            meetingTitle: formData.get('meetingTitle'),
            meetingContent: formData.get('meetingContent'),
            meetingStartTime: formData.get('meetingStartDate') + 'T' + formData.get('meetingStartTime'),
            meetingEndTime: formData.get('meetingEndDate') + 'T' + formData.get('meetingEndTime')
        };


        fetch('/pm/meetings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meetingData)
        })
            .then(response => {
                if (response.ok) {
                    // 성공적으로 추가되었을 때 처리
                    alert('회의 일정이 성공적으로 추가되었습니다.');
                    $('#addMeetingModal').modal('hide');
                    location.reload()
                } else {
                    // 오류 발생 시 처리
                    alert('회의 일정 추가 중 오류가 발생했습니다.');
                }
            });
    });
});