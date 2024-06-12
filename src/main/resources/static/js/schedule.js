$(document).ready(function() {
    var employee_code = $('meta[name="employee-code"]').attr('content');
    var department_id = $('meta[name="department-id"]').attr('content');
    var currentEvent;

    var calendarEl = $('#calendar')[0];
    var dayCalendarEl = $('#day-calendar')[0];

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        timeZone: 'local',
        locale: 'ko',
        height: 'auto',
        headerToolbar: {
            start: 'today',
            end: 'prev,next'
        },
        buttonText: {
            today: '오늘'
        },
        editable: false,
        eventResizableFromStart: false,
        selectable: true,
        droppable: false,
        events: function(info, successCallback, failureCallback) {
            $.ajax({
                url: '/sc/list',
                method: 'GET',
                success: function(events) {
                    successCallback(events);
                },
                error: function() {
                    alert('일정 목록을 불러오는 데 실패했습니다.');
                    failureCallback();
                }
            });
        },
        select: function(info) {
            var startDate = new Date(info.start);
            var endDate = new Date(info.start);

            // 시작 시간을 전일의 시작으로 설정
            startDate.setHours(0, 0, 0, 0);
            // 종료 시간을 전일의 종료로 설정
            endDate.setHours(23, 59, 59, 999);

            var startString = startDate.getFullYear() + '-' +
                ('0' + (startDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + startDate.getDate()).slice(-2) + 'T' +
                ('0' + startDate.getHours()).slice(-2) + ':' +
                ('0' + startDate.getMinutes()).slice(-2);

            var endString = endDate.getFullYear() + '-' +
                ('0' + (endDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + endDate.getDate()).slice(-2) + 'T' +
                ('0' + endDate.getHours()).slice(-2) + ':' +
                ('0' + endDate.getMinutes()).slice(-2);

            $('#eventTitle').val('');
            $('#eventDescription').val('');
            $('#eventStart').val(startString);
            $('#eventEnd').val(endString);
            $('#eventType').val('');
            $('#deleteEventBtn').hide();
            $('#eventModalLabel').text('이벤트 등록');
            $('#submitEventBtn').text('등록');
            $('#eventModal').modal('show');
            currentEvent = null;
        },
        eventClick: function(info) {
            currentEvent = info.event;
            var startDate = new Date(info.event.start);
            var endDate = info.event.end ? new Date(info.event.end) : null;

            var startString = startDate.getFullYear() + '-' +
                ('0' + (startDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + startDate.getDate()).slice(-2) + 'T' +
                ('0' + startDate.getHours()).slice(-2) + ':' +
                ('0' + startDate.getMinutes()).slice(-2);

            var endString = endDate ? endDate.getFullYear() + '-' +
                ('0' + (endDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + endDate.getDate()).slice(-2) + 'T' +
                ('0' + endDate.getHours()).slice(-2) + ':' +
                ('0' + endDate.getMinutes()).slice(-2) : '';

            $('#eventTitle').val(info.event.title);
            $('#eventDescription').val(info.event.extendedProps.description);
            $('#eventStart').val(startString);
            $('#eventEnd').val(endString);
            $('#eventType').val(info.event.extendedProps.type);
            $('#eventModalLabel').text('이벤트 수정');
            $('#submitEventBtn').text('수정');
            $('#deleteEventBtn').show();
            $('#eventModal').modal('show');
        },
        eventDidMount: function(info) {
            var eventType = info.event.extendedProps.type;
            info.el.style.backgroundColor = getColorForType(eventType);
        }
    });

    var dayCalendar = new FullCalendar.Calendar(dayCalendarEl, {
        initialView: 'timeGridDay',
        timeZone: 'local',
        locale: 'ko',
        height: 'auto',
        headerToolbar: {
            start: 'today',
            end: 'prev,next'
        },
        buttonText: {
            today: '오늘'
        },
        editable: false,
        eventResizableFromStart: false,
        selectable: true,
        droppable: false,
        events: function(info, successCallback, failureCallback) {
            $.ajax({
                url: '/sc/list',
                method: 'GET',
                success: function(events) {
                    successCallback(events);
                },
                error: function() {
                    alert('일정 목록을 불러오는 데 실패했습니다.');
                    failureCallback();
                }
            });
        },
        select: function(info) {
            var isAllDay = info.allDay;
            var startDate = new Date(info.start);
            var endDate = new Date(info.start);

            if (isAllDay) {
                // all-day 클릭 시 전일 시간 설정
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
            }

            var startString = startDate.getFullYear() + '-' +
                ('0' + (startDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + startDate.getDate()).slice(-2) + 'T' +
                ('0' + startDate.getHours()).slice(-2) + ':' +
                ('0' + startDate.getMinutes()).slice(-2);

            var endString = endDate.getFullYear() + '-' +
                ('0' + (endDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + endDate.getDate()).slice(-2) + 'T' +
                ('0' + endDate.getHours()).slice(-2) + ':' +
                ('0' + endDate.getMinutes()).slice(-2);

            $('#eventTitle').val('');
            $('#eventDescription').val('');
            $('#eventStart').val(startString);
            $('#eventEnd').val(endString);
            $('#eventType').val('');
            $('#deleteEventBtn').hide();
            $('#eventModalLabel').text('이벤트 등록');
            $('#submitEventBtn').text('등록');
            $('#eventModal').modal('show');
            currentEvent = null;
        },
        eventClick: function(info) {
            currentEvent = info.event;
            var startDate = new Date(info.event.start);
            var endDate = info.event.end ? new Date(info.event.end) : null;

            var startString = startDate.getFullYear() + '-' +
                ('0' + (startDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + startDate.getDate()).slice(-2) + 'T' +
                ('0' + startDate.getHours()).slice(-2) + ':' +
                ('0' + startDate.getMinutes()).slice(-2);

            var endString = endDate ? endDate.getFullYear() + '-' +
                ('0' + (endDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + endDate.getDate()).slice(-2) + 'T' +
                ('0' + endDate.getHours()).slice(-2) + ':' +
                ('0' + endDate.getMinutes()).slice(-2) : '';

            $('#eventTitle').val(info.event.title);
            $('#eventDescription').val(info.event.extendedProps.description);
            $('#eventStart').val(startString);
            $('#eventEnd').val(endString);
            $('#eventType').val(info.event.extendedProps.type);
            $('#eventModalLabel').text('이벤트 수정');
            $('#submitEventBtn').text('수정');
            $('#deleteEventBtn').show();
            $('#eventModal').modal('show');
        },
        eventDidMount: function(info) {
            var eventType = info.event.extendedProps.type;
            info.el.style.backgroundColor = getColorForType(eventType);
        }
    });

    calendar.render();
    dayCalendar.render();

    $('#eventForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        var title = $('#eventTitle').val();
        var description = $('#eventDescription').val();
        var startTime = $('#eventStart').val();
        var endTime = $('#eventEnd').val();
        var type = $('#eventType').val();

        if (!startTime) {
            alert("시작 날짜 및 시간을 입력하세요.");
            return;
        }

        startTime = startTime + ":00";
        endTime = endTime ? endTime + ":00" : null;

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
            updateEvent(eventData, currentEvent.id);
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
                calendar.refetchEvents();
                dayCalendar.refetchEvents();
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
                calendar.refetchEvents();
                dayCalendar.refetchEvents();
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
                calendar.refetchEvents();
                dayCalendar.refetchEvents();
                alert('이벤트가 삭제되었습니다.');
            },
            error: function() {
                alert('이벤트 삭제에 실패했습니다.');
            }
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
});
