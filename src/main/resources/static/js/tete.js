$(document).ready(function() {
    var employee_code = $('meta[name="employee-code"]').attr('content');
    var department_id = $('meta[name="department-id"]').attr('content');
    var currentEvent;

    var calendarEl = $('#calendar')[0];
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        timeZone: 'local',
        locale: 'ko',
        height: 'auto',
        headerToolbar: {
            left: 'today',
            right: 'prev,next'
        },
        buttonText: {
            today: '오늘',
        },
        editable: true,
        selectable: true,
        dayMaxEvents: true,
        events: '/sc/list', // 서버에서 일정 목록을 가져옴

        select: function(info) {
            $('#eventTitle').val('');
            $('#eventDescription').val('');
            $('#eventStart').val(info.startStr);
            $('#eventEnd').val(info.endStr ? info.endStr.slice(0, -1) : info.startStr);
            $('#eventType').val('');
            $('#deleteEventBtn').hide();
            $('#eventModalLabel').text('이벤트 등록');
            $('#submitEventBtn').text('등록');
            $('#eventModal').modal('show');
            currentEvent = null;
        },
        eventClick: function(info) {
            currentEvent = info.event;
            $('#eventTitle').val(info.event.title);
            $('#eventDescription').val(info.event.extendedProps.description);
            $('#eventStart').val(info.event.start.toISOString().slice(0, 10));
            $('#eventEnd').val(info.event.end ? info.event.end.toISOString().slice(0, 10) : '');
            $('#eventType').val(info.event.extendedProps.type);
            $('#eventModalLabel').text('이벤트 수정');
            $('#submitEventBtn').text('수정');
            $('#deleteEventBtn').show();
            $('#eventModal').modal('show');
        },
        eventDrop: function(info) {
            var updatedEvent = {
                title: info.event.title,
                start: info.event.start.toISOString(),
                end: info.event.end ? info.event.end.toISOString() : null,
                description: info.event.extendedProps.description,
                employeeCode: employee_code,
                departmentId: department_id,
                type: info.event.extendedProps.type
            };
            updateEvent(updatedEvent, info.event.id);
        },
        eventResize: function(info) {
            var updatedEvent = {
                title: info.event.title,
                start: info.event.start.toISOString(),
                end: info.event.end ? info.event.end.toISOString() : null,
                description: info.event.extendedProps.description,
                employeeCode: employee_code,
                departmentId: department_id,
                type: info.event.extendedProps.type
            };
            updateEvent(updatedEvent, info.event.id);
        },
        eventDidMount: function(info) {
            var eventType = info.event.extendedProps.type;
            info.el.style.backgroundColor = getColorForType(eventType);
        }
    });
    calendar.render();

    function formatDateTime(date) {
        var d = new Date(date);
        return d.getFullYear() + '-' +
            ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
            ('0' + d.getDate()).slice(-2) + 'T' +
            ('0' + d.getHours()).slice(-2) + ':' +
            ('0' + d.getMinutes()).slice(-2) + ':' +
            ('0' + d.getSeconds()).slice(-2);
    }

    $('#eventForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        var title = $('#eventTitle').val();
        var description = $('#eventDescription').val();
        var startTime = $('#eventStart').val() + 'T00:00:00';
        var endTime = $('#eventEnd').val() ? $('#eventEnd').val() + 'T23:59:59' : null;
        var type = $('#eventType').val();

        if (!startTime) {
            alert("시작 날짜를 입력하세요.");
            return;
        }

        var eventData = {
            title: title,
            start: startTime,
            end: endTime,
            description: description,
            employeeCode: employee_code,
            departmentId: department_id,
            type: type
        };

        if (currentEvent) {
            eventData.id = currentEvent.id;
            updateEvent(eventData);
        } else {
            createEvent(eventData);
        }
        $('#eventModal').modal('hide');
    });

    $('#deleteEventBtn').off('click').on('click', function() {
        if (currentEvent) {
            deleteEvent(currentEvent.id);
            currentEvent.remove();
            $('#eventModal').modal('hide');
        }
    });

    function createEvent(eventData) {
        $.ajax({
            url: '/sc/create',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(eventData),
            success: function() {
                loadEvents();
                alert('이벤트가 생성되었습니다.');
            },
            error: function() {
                alert('이벤트 생성에 실패했습니다.');
            }
        });
    }

    function updateEvent(eventData, eventId) {
        $.ajax({
            url: '/sc/update/' + eventId,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(eventData),
            success: function() {
                loadEvents();
                alert('이벤트가 업데이트되었습니다.');
            },
            error: function() {
                alert('이벤트 업데이트에 실패했습니다.');
            }
        });
    }

    function deleteEvent(eventId) {
        $.ajax({
            url: '/sc/delete/' + eventId,
            method: 'DELETE',
            success: function() {
                loadEvents();
                alert('이벤트가 삭제되었습니다.');
            },
            error: function() {
                alert('이벤트 삭제에 실패했습니다.');
            }
        });
    }

    function loadEvents() {
        $.ajax({
            url: '/sc/list',
            method: 'GET',
            success: function(events) {
                calendar.removeAllEvents();
                calendar.addEventSource(events);
                updateScheduleList(events);
            },
            error: function() {
                alert('일정 목록을 불러오는 데 실패했습니다.');
            }
        });
    }

    function formatDate(dateString) {
        var date = new Date(dateString);
        return date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('0' + date.getDate()).slice(-2);
    }

    function updateScheduleList(events) {
        var scheduleList = $('#schedule-list');
        scheduleList.empty();
        events.forEach(function(event) {
            var start = formatDate(event.start);
            var end = formatDate(event.end);
            var eventItem = $('<div class="event-item"></div>');
            eventItem.text(event.title + ' (' + start + ' - ' + end + ')');
            scheduleList.append(eventItem);
        });
    }

    function getColorForType(type) {
        switch (type) {
            case '회의': return 'red';
            case '업무': return 'purple';
            case '연차': return 'green';
            case '출장': return 'blue';
            case '휴가': return 'orange';
            default: return 'grey';
        }
    }

    loadEvents(); // 페이지 로드 시 이벤트 목록을 불러옵니다.
});
