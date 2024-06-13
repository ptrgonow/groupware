$(document).ready(function() {
    var employee_code = $('meta[name="employee-code"]').attr('content');
    var department_id = $('meta[name="department-id"]').attr('content');
    var currentEvent;

    var calendarEl = $('#calendar')[0];
    var dayCalendarEl = $('#day-calendar')[0];

    let debounceTimer;

    function debounce(func, delay) {
        return function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
        };
    }

    function setupCalendar(calendarEl, initialView, selectHandler, eventClickHandler, filterFunction) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: initialView,
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

            events: debounce(function(info, successCallback, failureCallback) {
                $.ajax({
                    url: '/sc/list',
                    method: 'GET',
                    success: function(events) {
                        // 필터링 적용
                        successCallback(filterFunction(events, info.start, info.end));
                    },
                    error: function() {
                        alert('일정 목록을 불러오는 데 실패했습니다.');
                        failureCallback();
                    }
                });
            }, 300), // 300ms 디바운스 시간
            select: selectHandler,
            eventClick: eventClickHandler,
            eventDidMount: function(info) {
                var eventType = info.event.extendedProps.type;
                info.el.style.backgroundColor = getColorForType(eventType);
            },
            datesSet: debounce(function() {
                calendar.refetchEvents();
            }, 300) // 300ms 디바운스 시간
        });

        calendar.render();
        return calendar;
    }

    function filterMonthly(events) {
        return events; // 필터링을 하지 않음
    }

    function filterDaily(events, start, end) {
        // 날짜 범위로 필터링
        return events.filter(function(event) {
            var eventDate = new Date(event.start);
            return eventDate >= start && eventDate < end;
        });
    }

    function formatDate(date) {
        return date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('0' + date.getDate()).slice(-2) + 'T' +
            ('0' + date.getHours()).slice(-2) + ':' +
            ('0' + date.getMinutes()).slice(-2);
    }

    function handleEventClick(info) {
        currentEvent = info.event;
        var startString = formatDate(new Date(info.event.start));
        var endString = info.event.end ? formatDate(new Date(info.event.end)) : '';

        $('#eventTitle').val(info.event.title);
        $('#eventDescription').val(info.event.extendedProps.description);
        $('#eventStart').val(startString);
        $('#eventEnd').val(endString);
        $('#eventType').val(info.event.extendedProps.type);
        $('#eventModalLabel').text('이벤트 수정');
        $('#submitEventBtn').text('수정');
        $('#deleteEventBtn').show();
        $('#eventModal').modal('show');
    }

    function handleSelect(info, isAllDay) {
        var startDate = new Date(info.start);
        var endDate = new Date(info.start);

        if (isAllDay) {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
        } else {
            endDate = new Date(info.end);
        }

        var startString = formatDate(startDate);
        var endString = formatDate(endDate);

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

    // Calendar 초기화
    var calendar, dayCalendar;

    if (calendarEl) {
        calendar = setupCalendar(calendarEl, 'dayGridMonth', function(info) {
            handleSelect(info, true);
        }, handleEventClick, filterMonthly);
    }

    if (dayCalendarEl) {
        dayCalendar = setupCalendar(dayCalendarEl, 'timeGridDay', function(info) {
            handleSelect(info, false);
        }, handleEventClick, filterDaily);
    }
});
