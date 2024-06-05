document.addEventListener('DOMContentLoaded', function() {
    // Chart Data
    var chartData = {
        invoices: {
            labels: ['Overdue', 'Not Due Yet', 'Paid', 'Not Deposited', 'Deposited'],
            data: {
                'Last Month': [1525.50, 3756.02, 2062.52, 1629.70],
                'Last 3 Months': [3000, 6000, 4000, 2000],
                'Last 6 Months': [5000, 7000, 6000, 3000],
                'Last 12 Months': [8000, 10000, 9000, 4000],
                'This Year': [10000, 12000, 11000, 5000]
            }
        },
        expenses: {
            labels: ['Miscellaneous', 'Maintenance and Repairs', 'Rent or Lease', 'Everything Else'],
            data: {
                'Last Month': [2666, 940, 900, 2447],
                'Last 3 Months': [5000, 2000, 1800, 4500],
                'Last 6 Months': [7000, 3000, 2700, 6000],
                'Last 12 Months': [10000, 4000, 3600, 8000],
                'This Year': [12000, 5000, 4500, 10000]
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
        },
        bankAccounts: {
            labels: ['Checking', 'Savings', 'Mastercard', 'Visa'],
            data: {
                'Last Month': [-3621.93, 200, 304.96, 0],
                'Last 3 Months': [-4000, 300, 500, 0],
                'Last 6 Months': [-4500, 400, 600, 0],
                'Last 12 Months': [-5000, 500, 700, 0],
                'This Year': [-5500, 600, 800, 0]
            }
        }
    };

    // Initialize Charts
    var invoicesChart = initChart('invoicesChart', 'bar', chartData.invoices.labels, chartData.invoices.data['Last Month']);
    var salesChart = initChart('salesChart', 'line', chartData.sales.labels, chartData.sales.data['Last Month']);
    var expensesChart = initChart('expensesChart', 'doughnut', chartData.expenses.labels, chartData.expenses.data['Last Month']);
    var profitLossChart = initChart('profitLossChart', 'pie', chartData.profitLoss.labels, chartData.profitLoss.data['Last Month']);
    var bankAccountsChart = initChart('bankAccountsChart', 'bar', chartData.bankAccounts.labels, chartData.bankAccounts.data['Last Month']);

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
    document.getElementById('bankAccountsSelect').addEventListener('change', function() {
        updateChart(bankAccountsChart, chartData.bankAccounts.labels, chartData.bankAccounts.data[this.value]);
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
                },
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
