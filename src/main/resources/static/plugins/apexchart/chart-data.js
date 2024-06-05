'use strict';

$(document).ready(function() {
    // 데이터 생성 함수 (랜덤 데이터 생성)
    function generateData(baseval, count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1; // x 값 랜덤 생성
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min; // y 값 랜덤 생성
            var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15; // z 값 랜덤 생성
            series.push([x, y, z]); // 생성된 데이터를 series 배열에 추가
            baseval += 86400000; // baseval 증가
            i++;
        }
        return series; // 생성된 데이터 배열 반환
    }

    // 막대 그래프 설정 (sales_chart)
    var columnCtx = document.getElementById("sales_chart");
    var columnConfig = {
        colors: ['#7638ff', '#fda600'], // 막대 색상 설정
        series: [
            { name: "Received", type: "column", data: [70, 150, 80, 180, 150, 175, 201, 60, 200, 120, 190, 160, 50] },
            { name: "Pending", type: "column", data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16, 80] }
        ],
        chart: { // 차트 설정
            type: 'bar',
            fontFamily: 'Poppins, sans-serif',
            height: 350,
            toolbar: { show: false }
        },
        plotOptions: { // 막대 스타일 설정
            bar: {
                horizontal: false,
                columnWidth: '60%',
                endingShape: 'rounded'
            },
        },
        dataLabels: { enabled: false }, // 데이터 라벨 비활성화
        stroke: { show: true, width: 2, colors: ['transparent'] }, // 막대 테두리 설정
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] }, // x축 레이블 설정
        yaxis: { title: { text: '$ (thousands)' } }, // y축 제목 설정
        fill: { opacity: 1 }, // 막대 채우기 불투명도 설정
        tooltip: { // 툴팁 설정
            y: {
                formatter: function(val) {
                    return "$ " + val + " thousands";
                }
            }
        }
    };

    // 막대 그래프 생성 및 렌더링
    var columnChart = new ApexCharts(columnCtx, columnConfig);
    columnChart.render();

    // 원형 그래프 설정 (invoice_chart)
    var pieCtx = document.getElementById("invoice_chart");
    var pieConfig = {
        colors: ['#7638ff', '#ff737b', '#fda600', '#1ec1b0'], // 원형 색상 설정
        series: [55, 40, 20, 10], // 데이터 값
        chart: { // 차트 설정
            fontFamily: 'Poppins, sans-serif',
            height: 350,
            type: 'donut',
        },
        labels: ['Paid', 'Unpaid', 'Overdue', 'Draft'], // 레이블 설정
        legend: { show: false }, // 범례 비활성화
        responsive: [ // 반응형 설정
            {
                breakpoint: 480,
                options: {
                    chart: { width: 200 },
                    legend: { position: 'bottom' }
                }
            }
        ]
    };

    // 원형 그래프 생성 및 렌더링
    var pieChart = new ApexCharts(pieCtx, pieConfig);
    pieChart.render();
});
