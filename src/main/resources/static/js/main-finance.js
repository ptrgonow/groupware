
document.addEventListener('DOMContentLoaded', function() {
    // Chart Data
    var chartData = {
        invoices: {
            labels: ['Overdue', 'Not Due Yet', 'Paid', 'Not Deposited', 'Deposited'],
            data: {
                'Last Month': [1525.50, 3756.02, 2062.52, 1629.70, 320],
                'Last 3 Months': [300, 600, 400, 200, 320],
                'Last 6 Months': [5000, 7000, 6000, 3000, 320],
                'Last 12 Months': [8000, 10000, 9000, 4000, 320],
                'This Year': [10000, 12000, 11000, 5000, 320]
            }
        },
        expenses: {
            labels: ['Miscellaneous', 'Salary', 'Maintenance and Repairs', 'Rent or Lease', 'Utilities', 'General Supplies'],
            data: {
                'Last Month': [2666, 940, 900, 2447, 1940, test],
                'Last 3 Months': [5000, 2000, 1800, 6500, 940, test],
                'Last 6 Months': [1000, 3000, 5700, 6000, 940, test],
                'Last 12 Months': [10000, 4000, 6600, 8000, 940, test],
                'This Year': [12000, 5000, 4500, 10000, 940, test]
            }
        },
        profitLoss: {
            labels: ['Income', 'Expenses'],
            data: {
                'Last Month': [8347, 6953],
                'Last 3 Months': [10000, 8000],
                'Last 6 Months': [15000, 12000],
                'Last 12 Months': [20000, 16000],
                'This Year': [25000, 20000]
            }
        },
        sales: {
            labels: ['Jan 1', 'Jan 7', 'Jan 14', 'Jan 21', 'Jan 28', 'Jan 31'],
            data: {
                'Last Month': [1100, 2200, 1800, 2300, 2900, 3400],
                'Last 3 Months': [1500, 2800, 2100, 2600, 3200, 3800],
                'Last 6 Months': [2000, 3400, 2600, 3200, 3800, 4200],
                'Last 12 Months': [2500, 4000, 3100, 3700, 4300, 4700],
                'This Year': [3000, 4600, 3600, 4200, 4800, 5200]
            }
        }
    };

    // Initialize Charts
    var invoicesChart = initChart('invoicesChart', 'horizontalBar', chartData.invoices.labels, chartData.invoices.data['Last Month']);
    var salesChart = initChart('salesChart', 'line', chartData.sales.labels, chartData.sales.data['Last Month']);
    var expensesChart = initChart('expensesChart', 'doughnut', chartData.expenses.labels, chartData.expenses.data['Last Month']);
    var profitLossChart = initChart('profitLossChart', 'pie', chartData.profitLoss.labels, chartData.profitLoss.data['Last Month']);

    // Fetch and update expenses chart
    fetch('/fm/expenses')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(d => d.itemName);
            const amounts = data.map(d => parseFloat(d.amount));
            updateChart(expensesChart, labels, amounts);
        });

    // Event Listeners for Dropdowns
    document.getElementById('invoicesSelect').addEventListener('change', function() {
        updateChart(invoicesChart, chartData.invoices.labels, chartData.invoices.data[this.value]);
    });
    document.getElementById('expensesSelect').addEventListener('change', function() {
        updateChart(expensesChart, chartData.expenses.labels, chartData.expenses.data[this.value]);
    });
    document.getElementById('profitLossSelect').addEventListener('change', function() {
        updateChart(profitLossChart, chartData.profitLoss.labels, chartData.profitLoss.data[this.value]);
    });
    document.getElementById('salesSelect').addEventListener('change', function() {
        updateChart(salesChart, chartData.sales.labels, chartData.sales.data[this.value]);
    });

    // Function to Initialize Chart
    function initChart(chartId, type, labels, data) {
        const ctx = document.getElementById(chartId).getContext('2d');
        return new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'left',
                }
            }
        });
    }

    // Function to Update Chart
    function updateChart(chart, labels, data) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    }
});

$(document).ready(function() {
    // 이벤트 위임 방식으로 클릭 이벤트 처리
    $(document).on('click', '.clickable-row', function() {
        window.location = $(this).data('href');
    });
});
