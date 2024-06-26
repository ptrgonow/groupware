$(document).ready(function() {

    getChartData();

});


function getChartData() {
    $.ajax({
        type: 'GET',
        url: '/finance/chart',
        success: function(response) {
            // 응답이 배열인지 확인하고 처리
            if (Array.isArray(response)) {
                renderChart(response);
            } else {
                console.error('응답 형식이 잘못되었습니다:', response);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX 요청 실패:', textStatus, errorThrown);
        }
    });
}

// 차트 렌더링 함수
function renderChart(chartData) {
    const chartBody = $('#expenseChart');

    // 레이블과 색상 매핑
    const colorMap = {
        '공과금': '#61a4ec',
        '임대료': '#f5cf58',
        '일반': '#28a745',
        '긴급': '#dc3545',
        // 필요한 경우 더 많은 매핑 추가
    };

    const labels = chartData.map(function(item) {
        return item.expenseType;
    });
    const data = chartData.map(function(item) {
        return item.totalCharge;
    });
    const backgroundColors = chartData.map(function(item) {
        return colorMap[item.expenseType] || '#17a2b8'; // 매핑되지 않은 항목에 대한 기본 색상
    });

    new Chart(chartBody, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 10
                }
            }
        }
    });
}

