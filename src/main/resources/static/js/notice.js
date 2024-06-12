document.addEventListener('DOMContentLoaded', function() {
    const daysElement = document.querySelector('.calendar .days');
    const monthElement = document.querySelector('.calendar .month-name');
    const prevElement = document.querySelector('.calendar .prev');
    const nextElement = document.querySelector('.calendar .next');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function updateCalendar() {
        daysElement.innerHTML = '';
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();

        monthElement.textContent = `${currentYear}년 ${currentMonth + 1}월`;

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('day');
            daysElement.appendChild(emptyDiv);
        }

        for (let i = 1; i <= lastDate; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = i;
            if (
                today.getFullYear() === currentYear &&
                today.getMonth() === currentMonth &&
                today.getDate() === i
            ) {
                dayDiv.classList.add('today');
            }
            daysElement.appendChild(dayDiv);
        }
    }

    function moveMonth(delta) {
        currentMonth += delta;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    }

    prevElement.addEventListener('click', () => moveMonth(-1));
    nextElement.addEventListener('click', () => moveMonth(1));

    updateCalendar();

});

