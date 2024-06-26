var mySubmissions = [];

$(document).ready(function() {
    // 폼 컨테이너에 폼 HTML 추가
    $('#formContent').html(paymentForm);

    collectTableData('#fm-tbl-approved-list', mySubmissions);
    initializePagination(mySubmissions, '#fm-tbl-approved-list', '#pagination-ap');
    getSalaryList();
    loadFormData();
    getChartData();

    // 테이블 행 클릭 이벤트 리스너
    $(document).on('click', '#fm-tbl-approved-list tr', handleTableRowClick);

    // Reset 버튼 기능 추가
    $('#resetBtn').on('click', clearFormFields);

    // Submit 버튼 이벤트 리스너
    $('#submitBtn').on('click', handleSubmit);

    // 폼 필드 변경 시 데이터 저장
    fields.forEach(function(field) {
        $('#' + field).on('change', saveFormData);
    });
});

// 테이블 행 클릭 핸들러
function handleTableRowClick() {
    var approvalId = $(this).data('approval-id');
    console.log(approvalId);

    $.get({
        url: `/ap/gt/${approvalId}`,
        success: function(token) {
            window.location.href = `/ap/detail/${token}`;
        }
    });
}

// 급여 리스트 조회 함수
function getSalaryList(pageNumber = 1) {
    $.ajax({
        type: 'GET',
        url: '/fi/sal/list',
        dataType: 'json',
        data: { page: pageNumber, pageSize: 6 },
        success: function(response) {
            console.log(response); // 응답 데이터 확인
            if (response && response.salList) {
                paginate(response.totalItem, response.salList);
            } else {
                console.error('응답 형식이 잘못되었습니다:', response);
            }
        },
    });
}

// 페이지네이션 함수
function paginate(totalItem, salList) {
    $('#pagination-mini').pagination({
        dataSource: salList,
        pageSize: 6,
        showPageNumbers: false,
        callback: function(data) {
            const salTbl = $('#salTbl');
            salTbl.empty();
            data.forEach(function(sal) {
                const salItem = `
                    <tr>
                        <td>${sal.employeeName}</td>
                        <td>${sal.departmentName}</td>
                        <td>${sal.positionName}</td>
                        <td>${sal.salary}</td>
                    </tr>
                `;
                salTbl.append(salItem);
            });
        }
    });
}

// 테이블 데이터 수집 함수
function collectTableData(tableBodySelector, dataArray) {
    $(tableBodySelector + ' tr').each(function() {
        var row = $(this).children('td');
        dataArray.push({
            approvalId: $(this).data('approval-id'), // 고유 ID 추가
            fileCd: row.eq(1).text(),
            employeeName: row.eq(2).text(),
            createdAt: row.eq(3).text()
        });
    });
}

// 페이지네이션 초기화 함수
function initializePagination(dataSource, tableBodyId, paginationId) {
    $(paginationId).pagination({
        dataSource: dataSource,
        pageSize: 6,
        callback: function(data) {
            var html = renderTable(data);
            $(tableBodyId).html(html);
        }
    });
}

// 테이블 렌더링 함수
function renderTable(data) {
    var html = '';
    data.forEach(function(item, index) {
        html += `
            <tr data-approval-id="${item.approvalId}">
                <td>${index + 1}</td>
                <td>${item.fileCd}</td>
                <td>${item.employeeName}</td>
                <td>${item.createdAt}</td>
            </tr>
        `;
    });
    return html;
}

// 폼 데이터 필드 목록
const fields = [
    'expenseType', 'issueDate', 'refNumber',
    'recipient', 'totalCharge', 'paymentAmount',
    'balance', 'memo'
];

// 지출 폼
const paymentForm = `

    <div class="form-group d-grid justify-content-end">
        <div class="fi-select mb-3">
            <label for="expenseType">지출 유형</label>
            <select id="expenseType" required>
                <option value="" selected>선택</option>
                <option value="공과금">공과금</option>
                <option value="임대료">임대료</option>
                <option value="일반">일반 지출</option>
                <option value="긴급">긴급 지출</option>
                <option value="기타">기타</option>
            </select>
        </div>
        <div class="fi-select mb-3">
            <label for="issueDate">날짜</label>
            <input type="date" name="issue_date" id="issueDate" required>
        </div>
    </div>
    
    <div class="d-flex justify-content-center align-content-center">
        <div>
            <div class="fi-input">
                <input type="text" name="ref_number" id="refNumber" required>
                <label for="refNumber">참조 번호</label>
                <span></span>
            </div>
            <div class="fi-input">
                <input type="text" name="recipient" id="recipient" required>
                <label for="recipient">지출처</label>
                <span></span>
            </div>
            <div class="fi-input">
                <input type="text" name="total_charge" id="totalCharge" required>
                <label for="totalCharge">지불금</label>
                <span></span>
            </div>
        </div>
        <div>
         
            <div class="fi-input">
                <textarea type="text" name="memo" id="memo"></textarea>
                <label for="memo">메모</label>
            </div>
        </div>
    </div>
    
`;

// 폼 데이터 저장 객체
let formData = {};

// 폼 데이터 저장 함수
function saveFormData() {
    fields.forEach(function(field) {
        const element = document.getElementById(field);
        formData[field] = element ? element.value : '';
    });
    localStorage.setItem('formData', JSON.stringify(formData));
}

// 폼 데이터 로드 함수
function loadFormData() {
    if (localStorage.getItem('formData')) {
        formData = JSON.parse(localStorage.getItem('formData'));
        fields.forEach(function(field) {
            const element = document.getElementById(field);
            if (element && formData[field] !== undefined) {
                element.value = formData[field];
            }
        });
    }
}

// Submit 버튼 클릭 핸들러
function handleSubmit(event) {
    event.preventDefault();

    // 필수 입력 필드 체크
    const requiredFields = ['issueDate', 'recipient', 'totalCharge'];
    for (let i = 0; i < requiredFields.length; i++) {
        const fieldId = requiredFields[i];
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            alert('데이터를 입력하세요');
            field.focus();
            return;
        }
    }

    const ExpenseDTO = {
        accountType: "payment",
        expenseType: $('#expenseType').val(),
        issueDate: $('#issueDate').val(),
        refNumber: $('#refNumber').val(),
        recipient: $('#recipient').val(),
        totalCharge: parseFloat($('#totalCharge').val()),
        paymentAmount: parseFloat($('#paymentAmount').val()),
        balance: parseFloat($('#balance').val()),
        memo: $('#memo').val()
    };

    $.ajax({
        url: '/finance/save',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(ExpenseDTO),
        success: function(data) {
            alert('데이터가 성공적으로 입력되었습니다.');
            clearFormFields();
            localStorage.removeItem('ExpenseDTO');
            window.location.reload();
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

// 입력 필드 초기화 함수
function clearFormFields() {
    fields.forEach(function(field) {
        $('#' + field).val('');
    });
    formData = {};
    localStorage.removeItem('formData');
}

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

