document.addEventListener('DOMContentLoaded', function() {

    var isAuthenticated = false; // 인증 여부를 추적하는 플래그
    var authTimeout; // 인증 타이머
    var currentPage = 1;
    var pageSize = 5;
    var allData = [];



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
                'Last Month': [2666, 940, 900, 2447, 1940, 320],
                'Last 3 Months': [5000, 2000, 1800, 6500, 940, 320],
                'Last 6 Months': [1000, 3000, 5700, 6000, 940, 320],
                'Last 12 Months': [10000, 4000, 6600, 8000, 940, 320],
                'This Year': [12000, 5000, 4500, 10000, 940, 320]
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

    // Function to Update Chart
    function updateChart(chart, labels, data) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    }

    // Event Listeners for Dropdowns
    document.getElementById('invoicesSelect').addEventListener('change', function () {
        updateChart(invoicesChart, chartData.invoices.labels, chartData.invoices.data[this.value]);
    });
    document.getElementById('expensesSelect').addEventListener('change', function () {
        updateChart(expensesChart, chartData.expenses.labels, chartData.expenses.data[this.value]);
    });
    document.getElementById('profitLossSelect').addEventListener('change', function () {
        updateChart(profitLossChart, chartData.profitLoss.labels, chartData.profitLoss.data[this.value]);
    });
    document.getElementById('salesSelect').addEventListener('change', function () {
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
                                        /*   -- CHART END --   */



    /*------------------------ Event Listener for department selection ------------------------*/
    document.getElementById('salaryStatus').addEventListener('change', function () {
        var departmentId = this.value;
        if (departmentId) {
            if (!isAuthenticated) {
                showPasswordModal(function() {
                    loadSalaries(departmentId, pageSize, currentPage, function(data, pageSize, currentPage) {
                        allData = data;
                        renderTable(allData, pageSize, currentPage);
                    });
                });
            } else {
                loadSalaries(departmentId, pageSize, currentPage, function(data, pageSize, currentPage) {
                    allData = data;
                    renderTable(allData, pageSize, currentPage);
                });
            }
        } else {
            document.getElementById('salaryTableBody').innerHTML = '';
        }
    });

    /*------------------------ Function to format date to yyyy-MM-dd ------------------------*/
    function formatDate(dateString) {
        var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options).replace(/. /g, '-').replace('.', '');
    }

    /*------------------------ Function to load salaries by department ------------------------*/
    function loadSalaries(departmentId, pageSize, currentPage, callback) {
        fetch('/fm/salariesByDepartment?departmentId=' + departmentId)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function(data) {
                if (!Array.isArray(data)) {
                    throw new Error('API response is not an array');
                }
                callback(data, pageSize, currentPage);
            })
            .catch(function(error) {
                console.error('Error loading salaries:', error);
                alert('Failed to load salary data. Please try again later.');
            });
    }


    /*------------------------ Document Ready for Dynamic Loading of Departments ------------------------*/
    $(document).ready(function() {
        $.get('/fm/departments', function(data) {
            var departmentSelect = $('#salaryStatus');
            data.forEach(function(department) {
                departmentSelect.append(new Option(department.departmentName, department.departmentId));
            });
        });

        // Check if the user is a finance manager
        $.get('/fm/checkFinanceManager?username=' + currentUser, function(response) {
            if (response.isFinanceManager) {
                isFinanceManager = true;
                isAuthenticated = true;
            }
        });
    });
                                        /*   -- SALARY BY DEPARTMENT END --   */



    /*------------------------ Function to render the table with pagination ------------------------*/
    function renderTable(data, pageSize, currentPage) {
        var tableBody = document.getElementById('salaryTableBody');
        if (!tableBody) {
            throw new Error('Element not found: salaryTableBody');
        }
        tableBody.innerHTML = '';  // 기존 내용을 초기화합니다

        var start = (currentPage - 1) * pageSize;
        var end = start + pageSize;
        var paginatedData = data.slice(start, end);

        paginatedData.forEach(function(salary, index) {
            var row = tableBody.insertRow();
            row.insertCell(0).textContent = start + index + 1;
            row.insertCell(1).textContent = salary.hireDate ? formatDate(salary.hireDate) : 'N/A';
            row.insertCell(2).textContent = salary.departmentName || 'N/A';
            row.insertCell(3).textContent = salary.positionName || 'N/A';
            row.insertCell(4).textContent = salary.employeeCode || 'N/A';
            row.insertCell(5).textContent = salary.amount || 'N/A';
        });
    }
    /*------------------------ Pagination Controls ------------------------*/
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable(allData, pageSize, currentPage);
        }
    });
    document.getElementById('nextPage').addEventListener('click', function() {
        if (currentPage * pageSize < allData.length) {
            currentPage++;
            renderTable(allData, pageSize, currentPage);
        }
    });
    /*   -- PAGINATION END --   */



    /*------------------------ Password Modal and Authentication ------------------------*/
    function showPasswordModal(callback) {
        $('#passwordModal').modal('show');
        $('#passwordForm').off('submit').on('submit', function (event) {
            event.preventDefault();
            var enteredPassword = $('#passwordInput').val();
            $.ajax({
                url: '/fm/authenticate',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ password: enteredPassword}),
                success: function (response) {
                    if (response) {
                        isAuthenticated = true;
                        $('#passwordModal').modal('hide');
                        startAuthTimer();
                        callback();
                    } else {
                        alert('비밀번호가 올바르지 않습니다.');
                    }
                },
                error: function () {
                    alert('Authentication failed. Please try again.');
                }
            });
        });
    }

    // 연봉 테이블 10분만 볼 수 있음.
    function startAuthTimer() {
        clearTimeout(authTimeout);  // 기존 타이머 제거
        authTimeout = setTimeout(function() {
            isAuthenticated = false;
            $('#salaryStatus').val('');  // 드롭다운 초기화
            $('#salaryTableBody').empty();  // 테이블 초기화
            alert('인증 시간이 만료되었습니다.');
        }, 10 * 60 * 1000);  // 10분 (10분 * 60초 * 1000밀리초)
    }
                                        /*   -- PASSWORD TO VIEW SALARY INFO END --   */
});
