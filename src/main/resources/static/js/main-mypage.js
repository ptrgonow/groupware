$(document).ready(function() {
    function updateProgressBars() {
        const startTime = new Date();
        startTime.setHours(9, 0, 0, 0); // 출근 시간 09:00
        const endTime = new Date();
        endTime.setHours(18, 0, 0, 0); // 퇴근 시간 18:00
        const currentTime = new Date();

        // 일간 근무 시간 계산
        const totalTimeDay = 8 * 60 * 60 * 1000; // 8시간
        const workedTimeDay = Math.max(0, currentTime - startTime);
        const percentageDay = Math.min(100, (workedTimeDay / totalTimeDay) * 100);

        $('#progressBarDay').css('width', `${percentageDay}%`).attr('aria-valuenow', percentageDay.toFixed(2));
        $('#totalDailyHours').text(`${Math.floor(workedTimeDay / 1000 / 60 / 60)}시간 ${Math.floor((workedTimeDay / 1000 / 60) % 60)}분`);

        if (workedTimeDay > totalTimeDay) {
            $('#progressBarDay').addClass('bg-danger').removeClass('bg-success');
        } else {
            $('#progressBarDay').addClass('bg-success').removeClass('bg-danger');
        }

        // 주간 근무 시간 계산
        const weekStartTime = new Date(startTime);
        weekStartTime.setDate(weekStartTime.getDate() - weekStartTime.getDay() + 1); // 이번 주 월요일
        weekStartTime.setHours(9, 0, 0, 0); // 월요일 출근 시간 09:00

        const daysWorked = Math.min(5, currentTime.getDay() - 1); // 월요일(1)부터 오늘까지 근무한 일수
        const workedWeeklyTime = daysWorked * 8 * 60 * 60 * 1000 + Math.max(0, currentTime - startTime); // 이미 근무한 시간 + 오늘 근무 시간
        const totalWeeklyTime = 40 * 60 * 60 * 1000; // 총 시간 (5일 * 8시간 = 40시간)
        const maxWeeklyTime = 52 * 60 * 60 * 1000; // 최대 시간 (52시간)
        const percentageWeek = Math.min(100, (workedWeeklyTime / totalWeeklyTime) * 100);
        const overtimePercentage = Math.min(100, ((workedWeeklyTime - totalWeeklyTime) / maxWeeklyTime) * 100);

        $('#progressBarWeek').css('width', `${percentageWeek}%`).attr('aria-valuenow', percentageWeek.toFixed(2));

        if (workedWeeklyTime > totalWeeklyTime) {
            $('#progressBarWeek').css('background-color', '#dc3545'); // Red color for overtime
        } else {
            $('#progressBarWeek').css('background-color', '#28a745'); // Green color for normal time
        }

        $('#totalWeeklyHours').text(`${Math.floor(workedWeeklyTime / 1000 / 60 / 60)}시간 ${Math.floor((workedWeeklyTime / 1000 / 60) % 60)}분`);

        // 연장 근무 시간 계산
        const overtimeDaily = Math.max(0, workedTimeDay - totalTimeDay);
        const overtimeWeekly = Math.max(0, workedWeeklyTime - totalWeeklyTime);

        $('#dailyOvertime').text(`${Math.floor(overtimeDaily / 1000 / 60 / 60)}시간 ${Math.floor((overtimeDaily / 1000 / 60) % 60)}분`);
        $('#weeklyOvertime').text(`${Math.floor(overtimeWeekly / 1000 / 60 / 60)}시간 ${Math.floor((overtimeWeekly / 1000 / 60) % 60)}분`);
    }

    function updateCurrentDay() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNumber = Math.ceil((((now - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);

        $('#currentDay').text(`${year}.${month}.${day} (${weekNumber}주차)`);
    }

    updateProgressBars();
    updateCurrentDay();
    setInterval(updateProgressBars, 60000); // 1분마다 업데이트
});
