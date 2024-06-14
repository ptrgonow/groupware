$(document).ready(function() {


    ClassicEditor
        .create(document.querySelector('#ap-editor'), {
            removePlugins: ['Heading'],
            language: "ko"
        })
        .then(editor => {
            $('style').append('.ck-content { height: 700px; }');
            let objEditor = editor;

            editor.model.document.on('change:data', () => {
                $('#ap-content').val(editor.getData());
            }, {priority: 'high'});
        })
        .catch(error => {
            console.error(error);
        });




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
                        'core' : {
                            'data' : treeData,
                            'check_callback' : true
                        },
                        'sort' : function(a, b) {
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
                        'plugins' : ['state', 'sort', 'types'],
                        'state' : { "opened" : true },
                        'types' : {
                            'default' : { 'icon' : 'department-icon' },
                            'employee' : { 'icon' : 'employee-icon' }
                        }
                    }).bind("loaded.jstree", function(event, data) {
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
        positions.forEach(function(position) {
            if (position && position.psCd) {
                positionMap[position.psCd] = position.psNm;
            }
        });

        console.log("Departments:", departments);
        console.log("Employees:", employees);
        console.log("Positions:", positions);

        // 부서 데이터를 먼저 추가하고 맵에 저장
        departments.forEach(function(department) {
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
        employees.forEach(function(employee) {
            if (employee && employee.departmentId) {
                var positionName = positionMap[employee.psCd] || employee.psCd; // 포지션 이름이 없으면 포지션 코드 사용
                var node = {
                    id: employee.employeeCode,
                    text: employee.name + " (" + positionName + ")",
                    parent: employee.departmentId,
                    type: 'employee',
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
});
