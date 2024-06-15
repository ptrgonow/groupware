$(document).ready(function () {
    let editorInstance;
    let isTreeReady = false; // 트리 초기화 상태를 추적하는 변수
    let isApTreeReady = false; // 새로운 트리 초기화 상태를 추적하는 변수
    let isCcTreeReady = false; // 새로운 수신참조 트리 초기화 상태를 추적하는 변수
    const employeeCode = $('meta[name="employeeCode"]').attr('content');

    ClassicEditor
        .create(document.querySelector('#ap-editor'), {
            removePlugins: ['Heading'],
            language: "ko"
        })
        .then(editor => {
            editorInstance = editor;
            $('style').append('.ck-content { height: 600px; }');

            updateEditorContent();

            // 실시간 업데이트를 위한 이벤트 리스너 추가
            document.querySelector('#ap-doc-no').addEventListener('change', updateEditorContent);
            document.querySelector('#ap-dueDate').addEventListener('change', updateEditorContent);
        })
        .catch(error => {
            console.error(error);
        });

    function updateEditorContent() {
        const docName = document.querySelector('#ap-doc-no').selectedOptions[0].textContent || '문서명 정보 없음';
        const docNo = document.querySelector('#ap-doc-no').value || '선택된 문서번호 없음';
        const dept = document.querySelector('#ap-dept').value || '부서 정보 없음';
        const writer = document.querySelector('#ap-writer').value || '기안자 정보 없음';
        const createAt = document.querySelector('#ap-createAt').value || '기안일 정보 없음';
        const dueDate = document.querySelector('#ap-dueDate').value || '마감일 정보 없음';

        const editorContent = `
            <table border="1">
                <div>
                    <span>${docName}</span>
                </div>
                   <tbody>
                    <tr>
                        <th>문서번호</th>
                        <th>기안부서</th>
                        <th>기안자</th>
                        <th>기안일</th>
                        <th>마감일</th>
                    </tr>
                    <tr>
                        <td>${docNo}</td>
                        <td>${dept}</td>
                        <td>${writer}</td>
                        <td>${createAt}</td>
                        <td>${dueDate}</td>
                    </tr>
                </tbody>
                <table>
                    <tbody>
                    <tr>
                        <th>제목</th>
                        <td colspan="2"></td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td colspan="2">
                          <br><br>
                          <br><br>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </table>
            
            <div>
                <h4>${createAt}</h4>
                <h1>Goott Inc.</h4>
            </div>
        `;

        if (editorInstance) {
            editorInstance.setData(editorContent);
        }
    }

    function listTreeData() {
        $.ajax({
            type: "GET",
            url: "/approval/tree",
            dataType: "json",
            success: function (data) {
                console.log("AJAX response data:", data);
                var treeData = formatTreeData(data.dept, data.emp, data.pos);
                console.log("Formatted tree data:", treeData);
                if (treeData.length > 0) {
                    $('#jstree-div').jstree({
                        'core': {
                            'data': treeData,
                            'check_callback': true
                        },
                        'sort': function (a, b) {
                            var nodeA = this.get_node(a);
                            var nodeB = this.get_node(b);

                            if (nodeA.parent !== nodeB.parent) {
                                return nodeA.parent.localeCompare(nodeB.parent);
                            }

                            if (nodeA.type === 'employee' && nodeB.type === 'default') {
                                return -1; // 직원이 부서보다 위로
                            }
                            if (nodeA.type === 'default' && nodeB.type === 'employee') {
                                return 1; // 부서가 직원보다 아래로
                            }

                            if (nodeA.type === 'employee' && nodeB.type === 'employee') {
                                return nodeA.original.positionOrder - nodeB.original.positionOrder;
                            }
                            return nodeA.text.localeCompare(nodeB.text);
                        },
                        'plugins': ['state', 'sort', 'types'],
                        'state': { "opened": true, 'selected': false },
                        'types': {
                            'default': { 'icon': 'department-icon' },
                            'employee': { 'icon': 'employee-icon' }
                        }
                    }).on("ready.jstree", function (event, data) {
                        isTreeReady = true; // 트리 초기화 완료
                        data.instance.deselect_all(true);
                        $('#inputContainer').empty();
                    }).on("select_node.jstree", function (e, data) {
                        // 기본 트리에서는 노드 선택을 비활성화
                        $('#jstree-div').jstree(true).deselect_node(data.node);
                    });

                    var apTreeData = filterTreeDataByEmployee(treeData, employeeCode, data.emp);
                    $('#ap-div').jstree({
                        'core': {
                            'data': apTreeData,
                            'check_callback': true
                        },
                        'sort': function (a, b) {
                            var nodeA = this.get_node(a);
                            var nodeB = this.get_node(b);

                            if (nodeA.parent !== nodeB.parent) {
                                return nodeA.parent.localeCompare(nodeB.parent);
                            }

                            if (nodeA.type === 'employee' && nodeB.type === 'default') {
                                return -1; // 직원이 부서보다 위로
                            }
                            if (nodeA.type === 'default' && nodeB.type === 'employee') {
                                return 1; // 부서가 직원보다 아래로
                            }

                            if (nodeA.type === 'employee' && nodeB.type === 'employee') {
                                return nodeA.original.positionOrder - nodeB.original.positionOrder;
                            }
                            return nodeA.text.localeCompare(nodeB.text);
                        },
                        'plugins': ['state', 'sort', 'types'],
                        'state': { "opened": true, 'selected': false },
                        'types': {
                            'default': { 'icon': 'department-icon' },
                            'employee': { 'icon': 'employee-icon' }
                        }
                    }).on("ready.jstree", function (event, data) {
                        isApTreeReady = true; // 새로운 트리 초기화 완료
                        data.instance.deselect_all(true);
                        $('#inputContainer').empty();
                    });

                    // cc-div에 대한 트리 초기화
                    $('#cc-div').jstree({
                        'core': {
                            'data': treeData, // 전체 트리를 다시 사용
                            'check_callback': true
                        },
                        'sort': function (a, b) {
                            var nodeA = this.get_node(a);
                            var nodeB = this.get_node(b);

                            if (nodeA.parent !== nodeB.parent) {
                                return nodeA.parent.localeCompare(nodeB.parent);
                            }

                            if (nodeA.type === 'employee' && nodeB.type === 'default') {
                                return -1; // 직원이 부서보다 위로
                            }
                            if (nodeA.type === 'default' && nodeB.type === 'employee') {
                                return 1; // 부서가 직원보다 아래로
                            }

                            if (nodeA.type === 'employee' && nodeB.type === 'employee') {
                                return nodeA.original.positionOrder - nodeB.original.positionOrder;
                            }
                            return nodeA.text.localeCompare(nodeB.text);
                        },
                        'plugins': ['state', 'sort', 'types'],
                        'state': { "opened": true, 'selected': false },
                        'types': {
                            'default': { 'icon': 'department-icon' },
                            'employee': { 'icon': 'employee-icon' }
                        }
                    }).on("ready.jstree", function (event, data) {
                        isCcTreeReady = true; // 새로운 수신참조 트리 초기화 완료
                        data.instance.deselect_all(true);
                    });

                } else {
                    console.error("No tree data available");
                }
            },
            error: function (e) {
                alert("오류 발생");
            }
        });
    }

    function filterTreeDataByEmployee(treeData, employeeCode, employees) {
        // 주어진 employeeCode에 해당하는 직원의 부서 및 상위 부서의 관리자만 필터링합니다.
        const employee = employees.find(emp => emp.employeeCode === employeeCode);
        if (!employee) return [];

        const deptIds = getParentDeptIds(employee.departmentId, treeData);
        return treeData.filter(node => {
            if (node.type === 'default') {
                return deptIds.includes(node.id);
            } else if (node.type === 'employee' && node.original.psCd === 'P001') {
                return deptIds.includes(node.parent);
            }
            return false;
        });
    }

    function getParentDeptIds(departmentId, treeData) {
        let deptIds = [departmentId];
        let parentDept = treeData.find(node => node.id === departmentId && node.type === 'default');
        while (parentDept && parentDept.parent !== "#") {
            deptIds.push(parentDept.parent);
            parentDept = treeData.find(node => node.id === parentDept.parent && node.type === 'default');
        }
        return deptIds;
    }

    function formatTreeData(departments, employees, positions) {
        var treeData = [];
        var departmentMap = {};
        var positionMap = {};
        var positionOrder = {
            'P001': 1, // 관리자
            'P002': 2, // 개발자
            'P004': 3, // 테스터
            'P007': 4, // 지원
            'P005': 5, // 인사
            'P006': 6  // 재무
        };

        // 포지션 데이터를 사전에 매핑
        positions.forEach(function (position) {
            if (position && position.psCd) {
                positionMap[position.psCd] = position.psNm;
            }
        });

        // 부서 데이터를 먼저 추가하고 맵에 저장
        departments.forEach(function (department) {
            if (department && department.departmentId) {
                var node = {
                    id: department.departmentId,
                    text: department.departmentName,
                    parent: department.parentDepartmentId || "#",
                    children: [],
                    type: 'default',
                    li_attr: { class: 'department-node' }
                };
                departmentMap[department.departmentId] = node;
                treeData.push(node);
            } else {
                console.error("Invalid department data:", department);
            }
        });

        // 직원 데이터를 부서 아래에 추가
        employees.forEach(function (employee) {
            if (employee && employee.departmentId) {
                var positionName = positionMap[employee.psCd] || employee.psCd; // 포지션 이름이 없으면 포지션 코드 사용
                var node = {
                    id: employee.employeeCode,
                    text: employee.name + " (" + positionName + ")",
                    parent: employee.departmentId,
                    type: 'employee',
                    original: {
                        psCd: employee.psCd
                    },
                    positionOrder: positionOrder[employee.psCd] || 999,
                    li_attr: { class: 'employee-node' }
                };
                treeData.push(node);
            } else {
                console.error("Invalid employee data:", employee);
            }
        });

        console.log("Final tree data:", treeData);

        return treeData;
    }

    listTreeData();

    // #toggle-cc 클릭 이벤트 리스너 추가
    $('#toggle-cc').on('click', function() {
        $('.cc-div').toggle(); // cc-div 요소를 토글
        if ($('.cc-div').is(':visible')) {
            $('.ap-div').hide(); // ap-div 요소를 숨김
            $('.jstree-div').hide(); // jstree-div 요소를 숨김
        } else {
            $('.jstree-div').show(); // jstree-div 요소를 표시
        }
    });

    // #toggle-ap 클릭 이벤트 리스너 추가
    $('#toggle-ap').on('click', function() {
        $('.ap-div').toggle(); // ap-div 요소를 토글
        if ($('.ap-div').is(':visible')) {
            $('.cc-div').hide(); // cc-div 요소를 숨김
            $('.jstree-div').hide(); // jstree-div 요소를 숨김
        } else {
            $('.jstree-div').show(); // jstree-div 요소를 표시
        }
    });

    // 페이지 로드 시 기본 트리뷰를 표시
    $(document).on('DOMContentLoaded', function() {
        $('.cc-div').hide();
        $('.ap-div').hide();
        $('.jstree-div').show();
    });

    // 페이지를 떠날 때 상태 초기화
    $(window).on('beforeunload', function() {
        $('.cc-div').hide();
        $('.ap-div').hide();
        $('.jstree-div').show();
    });

    $('#ap-div').on("select_node.jstree", function (e, data) {
        if (!isApTreeReady) return; // 새로운 트리가 준비되지 않은 상태에서는 실행하지 않음

        const employeeName = data.node.text;
        const employeeCode = data.node.id;
        const psCd = data.node.original.original.psCd;

        // 이미 추가된 사람인지 확인
        const isAlreadyAdded = $('#inputContainer input').filter(function() {
            return $(this).val() === employeeName;
        }).length > 0;

        if (isAlreadyAdded) {
            alert('이미 추가된 사람입니다.');
            return;
        }

        // psCd가 'P001'인 경우에만 처리
        if (psCd === 'P001') {
            const inputCount = $('#inputContainer input').length + 1;
            const newInput = `
                <div id="receiver" class="input-container">
                    <input type="text" class="form-control" id="sequence${inputCount}" value="${employeeName}" name="receiver" readonly />
                    <span class="remove-btn" onclick="removeInput(this)">x</span>
                </div>
            `;
            $('#inputContainer').append(newInput);
        } else {
            alert('관리자만 선택할 수 있습니다.');
        }
    });

    $('#cc-div').on("select_node.jstree", function (e, data) {
        if (!isCcTreeReady) return; // 수신참조 트리가 준비되지 않은 상태에서는 실행하지 않음

        const node = data.node;
        const nodeType = node.original.type;

        // 부서 노드는 클릭해도 아무 작업도 하지 않음
        if (nodeType === 'default') {
            $('#cc-div').jstree(true).deselect_node(node);
            return;
        }

        const employeeName = node.text;
        const employeeCode = node.id;

        // 이미 추가된 사람인지 확인
        const isAlreadyAdded = $('#cc input').filter(function() {
            return $(this).val() === employeeName;
        }).length > 0;

        if (isAlreadyAdded) {
            alert('이미 추가된 사람입니다.');
            return;
        }

        // 수신참조에 추가
        const inputCount = $('#cc input').length + 1;
        const newInput = `
            <div id="ccReceiver" class="input-container">
                <input type="text" class="form-control" id="cc${inputCount}" value="${employeeName}" name="cc" readonly />
                <span class="remove-btn" onclick="removeInput(this)">x</span>
            </div>
        `;
        $('#cc').append(newInput);
    });

    function getDocNo() {
        $.ajax({
            type: "GET",
            url: "/approval/docno",
            dataType: "json",
            success: function (data) {
                const selectElement = document.getElementById("ap-doc-no");
                console.log("AJAX docNo:", data);

                // Clear the existing options
                selectElement.innerHTML = '<option value="" selected>문서 선택</option>';

                // Check if data is available and is an array
                if (data && Array.isArray(data.docNos)) {
                    data.docNos.forEach(doc => {
                        const option = document.createElement("option");
                        option.value = doc.docNo; // Set the value as docNo
                        option.textContent = doc.docName; // Set the text as docName
                        selectElement.appendChild(option);
                    });
                } else {
                    console.error("No document numbers available");
                }
            },
            error: function (e) {
                alert("오류 발생");
            }
        });
    }

    getDocNo();

});

function removeInput(element) {
    $(element).parent().remove();

}
