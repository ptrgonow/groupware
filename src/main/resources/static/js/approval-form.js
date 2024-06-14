
$(document).ready(function (format, data) {

    let editorInstance;

    ClassicEditor
        .create(document.querySelector('#ap-editor'), {
            removePlugins: ['Heading'],
            language: "ko"
        })
        .then(editor => {
            editorInstance = editor;
            $('style').append('.ck-content { height: 700px; }');

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
                <h1>Goott Inc.</h1>
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
                if ( treeData.length > 0 ) {
                    $('#jstree-div').jstree({
                        'core': {
                            'data': treeData,
                            'check_callback': true
                        },
                        'sort': function (a, b) {
                            var nodeA = this.get_node(a);
                            var nodeB = this.get_node(b);

                            if ( nodeA.parent !== nodeB.parent ) {
                                return nodeA.parent.localeCompare(nodeB.parent);
                            }

                            if ( nodeA.type === 'employee' && nodeB.type === 'default' ) {
                                return -1; // 직원이 부서보다 위로
                            }
                            if ( nodeA.type === 'default' && nodeB.type === 'employee' ) {
                                return 1; // 부서가 직원보다 아래로
                            }

                            if ( nodeA.type === 'employee' && nodeB.type === 'employee' ) {
                                return nodeA.original.positionOrder - nodeB.original.positionOrder;
                            }
                            return nodeA.text.localeCompare(nodeB.text);
                        },
                        'plugins': ['state', 'sort', 'types'],
                        'state': {"opened": true},
                        'types': {
                            'default': {'icon': 'department-icon'},
                            'employee': {'icon': 'employee-icon'}
                        }
                    }).bind("loaded.jstree", function (event, data) {
                        data.instance.open_all();
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
            if ( position && position.psCd ) {
                positionMap[position.psCd] = position.psNm;
            }
        });

        console.log("Departments:", departments);
        console.log("Employees:", employees);
        console.log("Positions:", positions);

        // 부서 데이터를 먼저 추가하고 맵에 저장
        departments.forEach(function (department) {
            if ( department && department.departmentId ) {
                var node = {
                    id: department.departmentId,
                    text: department.departmentName,
                    parent: department.parentDepartmentId || "#",
                    children: [],
                    type: 'default',
                    li_attr: {class: 'department-node'}
                };
                departmentMap[department.departmentId] = node;
                treeData.push(node);
            } else {
                console.error("Invalid department data:", department);
            }
        });

        // 직원 데이터를 부서 아래에 추가
        employees.forEach(function (employee) {
            if ( employee && employee.departmentId ) {
                var positionName = positionMap[employee.psCd] || employee.psCd; // 포지션 이름이 없으면 포지션 코드 사용
                var node = {
                    id: employee.employeeCode,
                    text: employee.name + " (" + positionName + ")",
                    parent: employee.departmentId,
                    type: 'employee',
                    positionOrder: positionOrder[employee.psCd] || 999,
                    li_attr: {class: 'employee-node'}
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
                if ( data && Array.isArray(data.docNos) ) {
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
