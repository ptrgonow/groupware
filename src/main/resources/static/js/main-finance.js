document.addEventListener('DOMContentLoaded', function() {
    // Chart Data
    const chartData = {
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
    const invoicesChart = initChart('invoicesChart', 'horizontalBar', chartData.invoices.labels, chartData.invoices.data['Last Month']);
    const salesChart = initChart('salesChart', 'line', chartData.sales.labels, chartData.sales.data['Last Month']);
    const expensesChart = initChart('expensesChart', 'doughnut', chartData.expenses.labels, chartData.expenses.data['Last Month']);
    const profitLossChart = initChart('profitLossChart', 'pie', chartData.profitLoss.labels, chartData.profitLoss.data['Last Month']);

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

    // Fetch and update expenses chart - 미구현
    fetch('/fm/expenses')
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            const labels = data.map(function(d) { return d.itemName; });
            const amounts = data.map(function(d) { return d.amount; });
            updateChart(expensesChart, labels, amounts);
        });

    // Function to Update Chart - 미구현
    function updateChart(chart, labels, data) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    }
//------------------------------------------------CHART END------------------------------------------------//

    // Function to format date to yyyy-MM-dd
    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options).replace(/. /g, '-').replace('.', '');
    }

    // Function to load salaries by department
    function loadSalaries(departmentId) {
        fetch(`/fm/salariesByDepartment?departmentId=${departmentId}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (!Array.isArray(data)) {
                    throw new Error('API response is not an array');
                }

                console.log('Received data:', data);  // JSON 응답을 콘솔에 출력합니다.

                const tableBody = document.getElementById('salaryTableBody');
                if (!tableBody) {
                    throw new Error('Element not found: salaryTableBody');
                }
                tableBody.innerHTML = '';  // 기존 내용을 초기화합니다

                data.forEach((salary, index) => {
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = index + 1;
                    row.insertCell(1).textContent = salary.hireDate ? formatDate(salary.hireDate) : 'N/A';
                    row.insertCell(2).textContent = salary.departmentName || 'N/A';
                    row.insertCell(3).textContent = salary.ps_nm || 'N/A';
                    row.insertCell(4).textContent = salary.employeeCode || 'N/A';
                    row.insertCell(5).textContent = salary.amount || 'N/A';
                });
            })
            .catch(function(error) {
                console.error('Error loading salaries:', error);
            });
    }

    // Event Listener for department selection
    document.getElementById('salaryStatus').addEventListener('change', function () {
        const departmentId = this.value;
        if (departmentId) {
            loadSalaries(departmentId);
        }
    });

    // PAGING
    $(document).ready(function () {
        let currentPage = 1;
        let pageSize = 5;
        let allData = [];

        // Load departments dynamically
        $.get("/fm/departments", function (data) {
            var departmentSelect = $("#salaryStatus");
            data.forEach(function (department) {
                departmentSelect.append(new Option(department.departmentName, department.departmentId));
            });
        });

        // Handle department selection
        $("#salaryStatus").change(function () {
            const departmentId = $(this).val();
            if (departmentId === '') {
                $("#salaryTableBody").empty();
                return;
            }
            $.get(`/fm/salariesByDepartment?departmentId=${departmentId}`, function(data) {
                allData = data;
                currentPage = 1;
                renderTable();
            });
        });

        function renderTable() {
            const tableBody = $("#salaryTableBody");
            tableBody.empty();

            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            const paginatedData = allData.slice(start, end);

            paginatedData.forEach(function (salary, index) {
                tableBody.append(`
                    <tr>
                        <th scope="row">${start + index + 1}</th>
                        <td>${salary.hireDate ? formatDate(salary.hireDate) : ''}</td>
                        <td>${salary.departmentName || ''}</td>
                        <td>${salary.positionName || ''}</td>
                        <td>${salary.employeeCode || ''}</td>
                        <td>${salary.amount || ''}</td>
                    </tr>
                `);
            });
        }

        $("#prevPage").click(function (event) {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });

        $("#nextPage").click(function (event) {
            if (currentPage * pageSize < allData.length) {
                currentPage++;
                renderTable();
            }
        });
    });
//-------------------------------------SALARY including PAGINATION END--------------------------------------//

// Function to toggle between account types
    const accountSelect = document.getElementById('accountSelect');
    const formContent = document.getElementById('formContent');

    const paymentForm = `
            <ul>
                <label for="expenseType"></label>
                <li>
                분류 : 
                    <select id="expenseType" class="">
                        <option value="">- 선택 -</option>
                            
                            <option value="fixed_expenses">고정지출</option>
                                <option value="fixed_expenses_utilities">-수도·전기·가스</option>
                                <option value="fixed_expenses_rentOrLease">-임대료</option>
                                <option value="fixed_expenses_officeSupplies">-(일반)사무용품</option>
                                <option value="fixed_expenses_generalSalary">-(일반)급여</option>
                            
                            <option value="variable_expenses">변동지출</option>
                                <option value="fixed_expenses">-Miscellaneous</option>
                    </select>
                </li>
                    
                <li>
                    <label for="issueDate">날짜 : </label>
                    <input type="date" name="issue_date" id="issueDate">
                </li>
                <li>
                    <label for="refNumber">참조번호 : </label>
                    <input type="text" name="ref_number" id="refNumber">
                </li>
                <li>
                    <label for="recipient">수령인 : </label>
                    <input type="text" name="recipient" id="recipient">
                </li>
                <li>
                    <label for="totalCharge">지불금 : </label>
                    <input type="number" name="total_charge" id="totalCharge"> 원
                </li>
                <li>
                    <label for="paymentAmount">지급금 : </label>
                    <input type="number" name="payment_amount" id="paymentAmount"> 원
                </li>
                <li>
                    <label for="balance">잔액 : </label>
                    <input type="number" name="balance" id="balance"> 원
                </li>
                <li>
                    <label for="memo">메모 : </label>
                    <input type="text" name="memo" id="memo">
                </li>
            </ul>
        `;
    var receiptForm = `
        <ul>
            <li>
            분류 : 
                <label for="expenseType"></label>
                    <select id="expenseType" class="">
                        <option value="">- 선택 -</option>
                        <option value="accounts_receivables">매출채권</option>
                        <option value="notes_receivables">수취채권</option>
                        <option value="other_receivables">기타</option>
                    </select>
            </li>
            <li>
                <label for="receivableDate">날짜 : </label>
                <input type="date" name="receive_date" id="receiveDate">
            </li>
            <li>
                <label for="refNumber">참조번호 : </label>
                <input type="text" name="ref_number" id="refNumber">
            </li>
            <li>
                <label for="payer">지불인 : </label>
                <input type="text" name="payer" id="payer">
            </li>
            <li>
                <label for="receiptAmount">수납금 : </label>
                <input type="number" name="receipt_amount" id="receiptAmount"> 원
            </li>
            <li>
                <label for="balance">추가 잔액 : </label>
                <input type="number" name="balance" id="balance">
            </li>
            <li>
                <label for="memo">메모 : </label>
                <input type="text" name="memo" id="memo">
            </li>
        </ul>
        `;

        accountSelect.addEventListener('change', function () {
            if (accountSelect.value === 'payment') {
                formContent.innerHTML = paymentForm;
                addPaymentFormListeners(); // 초기 로딩 시에도 이벤트 리스너 추가
            } else if (accountSelect.value === 'receipt') {
                formContent.innerHTML = receiptForm;
            }
        });

        // 초기 로딩 시 기본 폼 설정
        formContent.innerHTML = paymentForm;
        addPaymentFormListeners(); // 초기 로딩 시에도 이벤트 리스너 추가

//--------------------------------------------DATA ENTRY 입력 END---------------------------------------------//

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', function (event) {
        event.preventDefault();

        const formData = {
            accountType: document.getElementById('accountSelect').value,
            expenseType: document.getElementById('expenseType').value,
            issueDate: document.getElementById('issueDate').value,
            refNumber: document.getElementById('refNumber').value,
            recipient: document.getElementById('recipient').value,
            totalCharge: parseFloat(document.getElementById('totalCharge').value),
            paymentAmount: parseFloat(document.getElementById('paymentAmount').value),
            balance: parseFloat(document.getElementById('balance').value),
            memo: document.getElementById('memo').value
        };

        fetch('/fm/saveExpense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                alert('Data saved successfully!');
            })
            .catch(function(error) {
                console.error('Error:', error);
            });
    });

    // 지불금 선지급금 잔액 자동 계산
    function addPaymentFormListeners() {
        const totalChargeInput = document.getElementById('totalCharge');
        const paymentAmountInput = document.getElementById('paymentAmount');
        const balanceInput = document.getElementById('balance');

        totalChargeInput.addEventListener('input', function() {
            const totalCharge = parseFloat(totalChargeInput.value) || 0;
            const paymentAmount = parseFloat(paymentAmountInput.value) || 0;
            balanceInput.value = totalCharge - paymentAmount;
        });

        paymentAmountInput.addEventListener('input', function() {
            const totalCharge = parseFloat(totalChargeInput.value) || 0;
            const paymentAmount = parseFloat(paymentAmountInput.value) || 0;
            balanceInput.value = totalCharge - paymentAmount;
        });
    }

//--------------------------------------------DATA TRANSFER 전송 END---------------------------------------------//


});

