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
        fetchMeetingDetail(meetingId);
    });

    // 회의 상세 정보 가져오기
    function fetchMeetingDetail(meetingId) {
        fetch(`/pm/meetings/detail?meetingId=${meetingId}`)
            .then(response => response.json())
            .then(data => {
                const meeting = data.meeting;
                const members = data.members;
                // 모달에 데이터 채우기
                $('#meetingId').val(meeting.meetingId);
                $('#meetingTitleDetail').val(meeting.meetingTitle);
                $('#meetingContentDetail').val(meeting.meetingContent);

                // LocalDateTime -> input type="datetime-local" 형식 변환
                $('#meetingStartTimeDetail').val(meeting.meetingStartTime.replace(" ", "T"));
                $('#meetingEndTimeDetail').val(meeting.meetingEndTime.replace(" ", "T"));
                const memberList = $('#member-list');
                memberList.empty();
                members.forEach((member) => {
                    memberList.append(`
                    <tr>
                        <td>${member.name}</td>
                        <td>${member.departmentName}</td>
                        <td>${member.positionName}</td>
                        <td><button type="button" class="btn btn-sm btn-danger remove-member-btn" data-employee-code="${member.employeeCode}">삭제</button></td>
                        <input type="hidden" id="eCode" value="${member.meetingMemberId}">
                    </tr>
                `);
                });

                // 모달 열기
                $('#meetingDetailModal').modal('show');
            })
            .catch(error => {
                console.error('Error fetching meeting details:', error);
                alert('회의 상세 정보를 가져오는 중 오류가 발생했습니다.');
            });
    }

    // 회의 멤버 추가 버튼 클릭 이벤트 처리
    $('#addMemberBtn').click(function () {
        fetchTeamMembers(); // 팀원 목록 가져오는 함수 호출
    });
    $('#toggle-mem').on('click', fetchTeamMembers);
    function fetchTeamMembers() {
        $.ajax({
            url: 'pm/meet/list', // 팀원 목록을 가져오는 API 엔드포인트
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
    $(document).on('click', '.select-member-btn', selectTeamMember);
    function selectTeamMember() {
        var name = $(this).data('name');
        var department = $(this).data('department');
        var position = $(this).data('position');
        var employeeCode = $(this).data('employee-code');
        var meetingId = $(this).data('id')
        $('#member-list').append(`
            <tr>
                <td>${name}</td>
                <td>${department}</td>
                <td>${position}</td>
                <td><button type="button" class="btn btn-sm btn-danger remove-member-btn" data-employee-code="${employeeCode}">삭제</button></td>
                <input type="hidden" id="mCode" value="${meetingId}">
            </tr>
        `);

        // 팀원 추가 모달 닫기
        $('#addMemberModal').modal('hide');
    }
    let deletedMembers = [];
    $('#member-list').on('click', '.remove-member-btn', function() {
        const meetingMemberId = $(this).closest('tr').find('input[type="hidden"]').val();

        if (meetingMemberId !== 0) { // 0이 아니면 삭제 목록에 추가
            deletedMembers.push(meetingMemberId);
        }
        $(this).closest('tr').remove();
    });
    console.log(deletedMembers);

    $('#updateMeetingForm').submit(function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const meetingId = formData.get('meetingId');
        const meetingMembers = [];
        $('#member-list tr').each(function () {
            let meetingId = $(this).find('#mCode').val();
            const employeeCode = $(this).find('button').data('employee-code');


            meetingMembers.push({
                meetingId : meetingId,
                employeeCode : employeeCode

            });

        });
        console.log(meetingMembers);
        const pmDTO = {
            meetingId: meetingId,
            meetingTitle: formData.get('meetingTitle'),
            meetingContent: formData.get('meetingContent'),
            meetingStartTime: formData.get('meetingStartTime'),
            meetingEndTime: formData.get('meetingEndTime'),
        }
        const meetingData = {
            // PmDTO 객체로 감싸기

                pmDTO : pmDTO,
                meetingMembers: meetingMembers,
                deletedMembers: deletedMembers

        };console.log("Data to be sent:", meetingData.pmDTO);
        console.log("Data to be sent:", meetingData.meetingMembers);
        console.log("Data to be sent:", meetingData.deletedMembers);

        $.ajax({
            type: "POST",
            url: "/pm/edit",
            contentType: "application/json",
            data: JSON.stringify(meetingData),
            success: function(response) {
                alert("회의 일정이 수정되었습니다.");
                $('#meetingDetailModal').modal('hide');
                location.reload();
            },
            error: function(error) {
                console.error('회의 일정 수정 오류:', error);
                alert('회의 일정 수정 중 오류가 발생했습니다.');
            }
        });
    });
});