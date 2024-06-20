$(document).ready( function() {
    const pageSize = 6;

    // 프로젝트 테이블 페이징 처리
    const projectTableBody = document.querySelector('#project_table_body');
    const projectTableRows = Array.from(projectTableBody.querySelectorAll('tr'));
    const projects = [];
    projectTableRows.forEach(function (row) {
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
        callback: function (data, pagination) {
            var html = renderProjectTable(data);
            $('#project_table_body').html(html);
        }
    });

    // 프로젝트 테이블 렌더링 함수
    function renderProjectTable(data) {
        var html = '';
        data.forEach(function (item, index) {
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
        const meetingId = $(row).data('meeting-id'); // $(row) 사용
        console.log(meetingId);
        meetings.push({
            index: row.cells[0].innerText.trim(), // index 추가
            meetingTitle: row.cells[1].innerText.trim(),
            formattedSchedule: row.cells[2].innerText.trim(),
            meetingId
        });
    });

    // 페이징 처리 (회의 테이블)
    $('#meetings-pagination-container').pagination({
        dataSource: meetings,
        pageSize: pageSize,
        callback: function (data, pagination) {
            // 페이지 변경 시 테이블 내용 업데이트
            $('#meetings-table tbody').empty();
            data.forEach((meeting, index) => { // index 추가

                $('#meetings-table tbody').append(`
                    <tr data-meeting-id=${meeting.meetingId}>
                        <td>${(pagination.pageNumber - 1) * pageSize + index + 1}</td> // 페이지 번호 고려
                        <td>${meeting.meetingTitle}</td>
                        <td>${meeting.formattedSchedule}</td>
                    </tr>
                `);
            });
        }
    });
    const addMeetingForm = document.getElementById('addMeetingForm');
    addMeetingForm.addEventListener('submit', function (event) {
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
    $('#meetings-table tbody').on('click', 'tr', function () {
        const meetingId = $(this).data('meeting-id');

        // 클릭된 행에서 데이터 가져오기
        const meetingTitle = $(this).find('td:nth-child(2)').text();
        const formattedSchedule = $(this).find('td:nth-child(3)').text();

        // 모달에 데이터 채우기
        $('#meetingId').val(meetingId);
        $('#meetingTitleDetail').val(meetingTitle);

        fetch(`/pm/meetings/${meetingId}`)
            .then(response => response.json())
            .then(meeting => {
                // 모달에 데이터 채우기
                $('#meetingContentDetail').val(meeting.meetingContent);

                // LocalDateTime -> input type="datetime-local" 형식 변환
                $('#meetingStartTimeDetail').val(meeting.meetingStartTime.replace(" ", "T")); // 공백을 'T'로 변경
                $('#meetingEndTimeDetail').val(meeting.meetingEndTime.replace(" ", "T"));
            })
            .catch(error => {
                console.error('Error fetching meeting details:', error);
                alert('회의 상세 정보를 가져오는 중 오류가 발생했습니다.');
            });

        $('#meetingDetailModal').modal('show'); // 모달 열기
    });
    $('#updateMeetingForm').submit(function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const meetingId = formData.get('meetingId');
        const meetingData = {
            meetingId: meetingId,

            meetingTitle: formData.get('meetingTitle'),
            meetingContent: formData.get('meetingContent'),
            meetingStartTime: formData.get('meetingStartTime'),
            meetingEndTime: formData.get('meetingEndTime')
        };
        console.log(meetingId);
        console.log(meetingData); // 전송되는 데이터 확인

        // AJAX 요청으로 서버에 데이터 전송 (PUT 요청)
        fetch(`/pm/editMeetings/${meetingId}`, { // 컨트롤러의 @PutMapping 경로에 맞게 수정
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meetingData)
        })

            .then(response => {
                if (response.ok) {
                    // 성공적으로 수정되었을 때 처리
                    alert('회의 일정이 성공적으로 수정되었습니다.');
                    $('#meetingDetailModal').modal('hide');
                    location.reload(); // 페이지 새로고침
                } else {
                    // 오류 발생 시 처리
                    alert('회의 일정 수정 중 오류가 발생했습니다.');
                }
            });
    });

    $('#meetingDetailModal').on('click', '#deleteMeetingBtn', function () {
        const meetingId = $('#meetingId').val(); // 모달에서 meetingId 가져오기
        console.log(meetingId);
        if (confirm('정말로 회의를 삭제하시겠습니까?')) {
            // AJAX 요청으로 회의 삭제
            fetch(`/pm/deleteMeetings/${meetingId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        alert('회의 일정이 성공적으로 삭제되었습니다.');
                        $('#meetingDetailModal').modal('hide');
                        location.reload(); // 페이지 새로고침
                    } else {
                        alert('회의 일정 삭제 중 오류가 발생했습니다.');
                    }
                });
        }
    });
});
