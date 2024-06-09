document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const endButton = document.getElementById('end-button');
    const actionInput = document.getElementById('action');
    const timeInput = document.getElementById('time');
    const form = document.getElementById('attendance-form');
    const employeeCodeInput = document.querySelector('input[name="employee_code"]');

    let startTime;
    let endTime;

    startButton.addEventListener('click', () => {
        startTime = new Date();
        actionInput.value = 'start';
        timeInput.value = startTime.toISOString();
        startButton.disabled = true;
        endButton.disabled = false;
        form.submit();
    });

    endButton.addEventListener('click', () => {
        endTime = new Date();
        actionInput.value = 'end';
        timeInput.value = endTime.toISOString();
        startButton.disabled = false;
        endButton.disabled = true;
        form.submit();
    });

    // 초기 로드 시 버튼 상태를 설정합니다.
    fetch(`/att/status?employee_code=${employeeCodeInput.value}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === '근무중') {
                startButton.disabled = true;
                endButton.disabled = false;
            } else if (data.status === '퇴근') {
                startButton.disabled = false;
                endButton.disabled = true;
            }
        });

    // 근태 기록을 가져와서 프로그레스 바를 업데이트합니다.
    fetch(`/att/records?employee_code=${employeeCodeInput.value}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const today = new Date();
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);

                let dailyHours = 0;
                let weeklyHours = 0;

                data.forEach(record => {
                    const checkIn = new Date(record.checkIn);
                    const checkOut = record.checkOut ? new Date(record.checkOut) : new Date();

                    if (checkIn.toDateString() === today.toDateString()) {
                        dailyHours += (checkOut - checkIn) / (1000 * 60 * 60);
                    }

                    if (checkIn >= weekStart && checkIn <= weekEnd) {
                        weeklyHours += (checkOut - checkIn) / (1000 * 60 * 60);
                    }
                });

                const dailyProgressValue = Math.min(dailyHours / 8, 1);
                const weeklyProgressValue = Math.min(weeklyHours / 40, 1);

                updateProgressBar('daily-progress-container', dailyProgressValue, dailyHours);
                updateProgressBar('weekly-progress-container', weeklyProgressValue, weeklyHours);
            }
        })
        .catch(error => console.error('Error fetching attendance records:', error));
});

function updateProgressBar(containerId, progressValue, hours) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container does not exist: ${containerId}`);
        return;
    }

    const formattedTime = formatTime(hours);

    var bar = new ProgressBar.Circle(container, {
        color: '#aaa',
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1400,
        text: {
            value: formattedTime,
            autoStyleContainer: false
        },
        from: { color: '#aaa', width: 1 },
        to: { color: '#333', width: 4 },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 100);
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText(`${formattedTime}\n${value}%`);
            }
        }
    });
    bar.text.style.fontFamily = '"Noto Sans", "Roboto", sans-serif';
    bar.text.style.textAlign = 'center';

    bar.animate(progressValue);  // Number from 0.0 to 1.0
}

function formatTime(hours) {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}시간 ${m}분`;
}
