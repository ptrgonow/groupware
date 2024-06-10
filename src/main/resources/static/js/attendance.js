$(document).ready(function() {
    const startButton = $('#start-button');
    const endButton = $('#end-button');
    const actionInput = $('#action');
    const form = $('#attendance-form');
    const employeeCodeInput = $('input[name="employee_code"]');

    function handleButtonClick(action) {
        actionInput.val(action);

        if (action === 'start') {
            startButton.prop('disabled', true);
            endButton.prop('disabled', false);
        } else if (action === 'end') {
            startButton.prop('disabled', false);
            endButton.prop('disabled', true);
        }

        // AJAX 요청으로 폼 제출
        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: form.serialize(),
            success: function(response) {
                // 폼 제출 성공 시 메인 화면으로 리다이렉트
                window.location.href = '/';
            },
            error: function(xhr, status, error) {
                console.error('폼 제출 중 오류 발생:', error);
                if (action === 'start') {
                    startButton.prop('disabled', false);
                    endButton.prop('disabled', true);
                } else if (action === 'end') {
                    startButton.prop('disabled', true);
                    endButton.prop('disabled', false);
                }
            }
        });
    }

    startButton.click(function() {
        handleButtonClick('start');
    });

    endButton.click(function() {
        handleButtonClick('end');
    });

    // 초기 로드 시 버튼 상태를 설정합니다.
    $.ajax({
        url: `/att/status?employee_code=${employeeCodeInput.val()}`,
        type: 'GET',
        success: function(data) {
            if (data && data.status === '근무중') {
                startButton.prop('disabled', true);
                endButton.prop('disabled', false);
            } else if (data && data.status === '퇴근') {
                startButton.prop('disabled', false);
                endButton.prop('disabled', true);
            }
        },
        error: function(xhr, status, error) {
            console.error('근무 상태를 가져오는 중 오류 발생:', error);
        }
    });

    // 실시간으로 프로그레스 바를 업데이트합니다.
    function updateAttendanceRecords() {
        $.ajax({
            url: `/att/records?employee_code=${employeeCodeInput.val()}`,
            type: 'GET',
            success: function(data) {
                if (data && data.length > 0) {
                    const today = new Date();
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay()); // 일요일로 설정
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6); // 토요일로 설정

                    let dailyHours = 0;
                    let weeklyHours = 0;

                    data.forEach(record => {
                        const checkIn = new Date(record.checkIn);
                        const checkOut = record.checkOut ? new Date(record.checkOut) : new Date();

                        console.log(`Record: ${JSON.stringify(record)}`);
                        console.log(`CheckIn: ${checkIn}, CheckOut: ${checkOut}`);

                        if (checkIn.toDateString() === today.toDateString()) {
                            dailyHours += (checkOut - checkIn) / (1000 * 60 * 60);
                        }

                        if (checkIn >= weekStart && checkIn <= weekEnd) {
                            weeklyHours += (checkOut - checkIn) / (1000 * 60 * 60);
                        }
                    });

                    console.log(`Daily Hours: ${dailyHours}`);
                    console.log(`Weekly Hours: ${weeklyHours}`);

                    // 일일 근무 시간 퍼센트 계산 (최대 8시간 기준)
                    const dailyProgressValue = Math.min(dailyHours / 8, 1);

                    // 주간 근무 시간 퍼센트 계산 (최대 40시간 기준, 초과 시간 포함)
                    let weeklyProgressValue;
                    if (weeklyHours > 40) {
                        weeklyProgressValue = 1 + (weeklyHours - 40) / 12;
                    } else {
                        weeklyProgressValue = weeklyHours / 40;
                    }

                    weeklyProgressValue = Math.min(weeklyProgressValue, 1.3); // 1.3 (130%) 최대값 설정

                    updateProgressBar('daily-progress-container', dailyProgressValue, dailyHours);
                    updateProgressBar('weekly-progress-container', weeklyProgressValue, weeklyHours);
                } else {
                    console.error('근태 기록이 없습니다.');
                    updateProgressBar('daily-progress-container', 0, 0);
                    updateProgressBar('weekly-progress-container', 0, 0);
                }
            },
            error: function(xhr, status, error) {
                console.error('근태 기록을 가져오는 중 오류 발생:', error);
            }
        });
    }

    // 주기적으로 프로그레스 바 업데이트
    setInterval(updateAttendanceRecords, 60000); // 1분마다 업데이트

    // 초기 로드 시 한 번 업데이트
    updateAttendanceRecords();
});

function updateProgressBar(containerId, progressValue, hours) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`컨테이너가 존재하지 않습니다: ${containerId}`);
        return;
    }

    // 기존의 프로그레스 바 제거
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const formattedTime = formatTime(hours);

    const bar = new ProgressBar.Circle(container, {
        color: '#aaa',
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1400,
        text: {
            value: `${formattedTime}\n${Math.round(progressValue * 100)}%`,
            autoStyleContainer: false
        },
        from: {color: '#aaa', width: 1},
        to: {color: '#333', width: 4},
        step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            const value = Math.round(circle.value() * 100);
            if ( value === 0 ) {
                circle.setText('');
            } else {
                circle.setText(`${formattedTime}\n${value}%`);
            }
        }
    });
    bar.text.style.fontFamily = '"Noto Sans", "Roboto", sans-serif';
    bar.text.style.textAlign = 'center';

    bar.animate(progressValue);  // 0.0에서 1.0 사이의 숫자
}

function formatTime(hours) {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}시간 ${m}분`;
}
