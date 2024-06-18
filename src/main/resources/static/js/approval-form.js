$(document).ready(function (format) {
    let editorInstance;
    let isTreeReady = false;
    let isApTreeReady = false;
    let isCcTreeReady = false;
    const employeeCode = $('meta[name="employeeCode"]').attr('content');

    initializeEditor();
    initializeEventListeners();
    fetchData('/approval/tree', 'json', initializeTrees);
    fetchData('/approval/docno', 'json', populateDocNoDropdown);

    function initializeEditor() {
        ClassicEditor
            .create(document.querySelector('#ap-editor'), {
                removePlugins: ['Heading'],
                language: "ko"
            })
            .then(editor => {
                editorInstance = editor;
                $('style').append('.ck-content { height: 600px; }');
                updateEditorContent();
                addEditorContentChangeListeners();
            })
            .catch(error => {
                console.error(error);
            });
    }

    function updateEditorContent() {
        const docName = document.querySelector('#ap-doc-no').selectedOptions[0].textContent || '문서명 정보 없음';
        const docNo = document.querySelector('#ap-doc-no').value || '선택된 문서번호 없음';
        const dept = document.querySelector('#ap-dept').value || '부서 정보 없음';
        const writer = document.querySelector('#ap-writer-name').value || '기안자 정보 없음';
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

    function addEditorContentChangeListeners() {
        document.querySelector('#ap-doc-no').addEventListener('change', updateEditorContent);
        document.querySelector('#ap-dueDate').addEventListener('change', updateEditorContent);
    }

    function initializeEventListeners() {
        $('#toggle-cc').on('click', function() {
            toggleElementVisibility('.cc-div', ['.ap-div', '.jstree-div']);
        });

        $('#toggle-ap').on('click', function() {
            toggleElementVisibility('.ap-div', ['.cc-div', '.jstree-div']);
        });

        $(document).on('DOMContentLoaded', function() {
            initializeDefaultView();
        });

        $(window).on('beforeunload', function() {
            initializeDefaultView();
        });

        $('#ap-div').on("select_node.jstree", function (e, data) {
            if (isApTreeReady) handleNodeSelection(data, '#inputContainer', 'P001');
        });

        $('#cc-div').on("select_node.jstree", function (e, data) {
            if (isCcTreeReady) handleNodeSelection(data, '#cc', null, true);
        });

        $('#ap-btn').on('click', function(event) {
            event.preventDefault();

            let approvalDTO = {
                fileCd: $('#ap-doc-no').val(),  // 문서번호 필드
                employeeCode: $('#ap-writer').val(),
                createAt: $('#ap-createAt').val(),
                dueDate: $('#ap-dueDate').val(),
                content: editorInstance.getData(format)
            };

            let formData = {
                approvalDTO: approvalDTO,
                approvalPath: [],
                approvalReferences: [],
                approvalConsensus: []
            };

            $('#inputContainer input[type="hidden"]').each(function() {
                formData.approvalPath.push($(this).val());
            });

            $('#cc input[type="hidden"]').each(function() {
                let employeeCode = $(this).val();
                formData.approvalReferences.push(employeeCode);

                // 관리자인 경우 approvalConsensus에 추가
                let node = $('#cc-div').jstree(true).get_node(employeeCode);
                if (node.original.original.psCd === 'P001') {
                    formData.approvalConsensus.push(employeeCode);
                }
            });

            console.log("Data to be sent:", formData); // 데이터 확인용 로깅

            $.ajax({
                type: "POST",
                url: "/approval/send",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function(response) {
                    alert("결재가 성공적으로 제출되었습니다.");
                    window.location.href = "/ap/amain";
                },
                error: function(error) {
                    alert("오류 발생: " + error.responseText);
                }
            });
        });
    }

    function toggleElementVisibility(showSelector, hideSelectors) {
        $(showSelector).toggle();
        hideSelectors.forEach(selector => $(selector).hide());
        if (!$(showSelector).is(':visible')) {
            $('.jstree-div').show();
        }
    }

    function initializeDefaultView() {
        $('.cc-div').hide();
        $('.ap-div').hide();
        $('.jstree-div').show();
    }

    function showMessage(message) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        messageContainer.style.color = 'red';
        messageContainer.style.textAlign = 'center';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 2000);
    }

    function handleNodeSelection(data, containerSelector, requiredPsCd, excludeDefault = false) {
        const node = data.node;
        const nodeType = node.original.type;
        const psCd = node.original.original.psCd;

        if (excludeDefault && nodeType === 'default') {
            $(containerSelector).jstree(true).deselect_node(node);
            return;
        }

        if (requiredPsCd && psCd !== requiredPsCd) {
            showMessage('관리자만 선택할 수 있습니다.');
            return;
        }

        const employeeName = node.text;
        const employeeCode = node.id;
        if (!isAlreadyAdded(containerSelector, employeeName)) {
            addNewInput(containerSelector, employeeName, employeeCode);
        } else {
            showMessage('해당 직원은 추가되어 있습니다.');
        }
    }


    function isAlreadyAdded(containerSelector, employeeName) {
        return $(containerSelector + ' input').filter(function() {
            return $(this).val() === employeeName;
        }).length > 0;
    }

    function addNewInput(containerSelector, employeeName, employeeCode) {
        const inputCount = $(containerSelector + ' input').length + 1;
        const newInput = `
            <div id="receiver" class="input-container">
                <input type="hidden" class="form-control" id="${containerSelector.slice(1)}${inputCount}" name="employeeCode" value="${employeeCode}" readonly />
                <input type="text" class="form-control receiver" value="${employeeName}" readonly />
                <span class="remove-btn" onclick="removeInput(this)">x</span>
            </div>
        `;
        $(containerSelector).append(newInput);
    }

    function fetchData(url, dataType, successCallback) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: dataType,
            success: function (data) {
                successCallback(data);
            },
            error: function (e) {
                alert("오류 발생");
            }
        });
    }

    function initializeTrees(data) {
        const treeData = formatTreeData(data.dept, data.emp, data.pos);
        initializeJsTree('#jstree-div', treeData, () => { isTreeReady = true; });
        const apTreeData = filterTreeDataByEmployee(treeData, employeeCode, data.emp);
        initializeJsTree('#ap-div', apTreeData, () => { isApTreeReady = true; });
        initializeJsTree('#cc-div', treeData, () => { isCcTreeReady = true; }, true);
    }

    function initializeJsTree(selector, treeData, onReadyCallback, excludeDefault = false) {
        $(selector).jstree({
            'core': {
                'data': treeData,
                'check_callback': true
            },
            'sort': function (a, b) {
                return sortTreeNodes(this, a, b);
            },
            'plugins': ['state', 'sort', 'types'],
            'state': { "opened": true, 'selected': false },
            'types': {
                'default': { 'icon': 'department-icon' },
                'employee': { 'icon': 'employee-icon' }
            }
        }).on("ready.jstree", function (event, data) {
            onReadyCallback();
            data.instance.open_all();
            data.instance.deselect_all(true);
            $(selector).siblings('.append').empty();
        }).on("select_node.jstree", function (e, data) {
            if (excludeDefault && data.node.original.type === 'default') {
                $(selector).jstree(true).deselect_node(data.node);
            }
        });
    }

    function sortTreeNodes(treeInstance, a, b) {
        const nodeA = treeInstance.get_node(a);
        const nodeB = treeInstance.get_node(b);

        if (nodeA.parent !== nodeB.parent) {
            return nodeA.parent.localeCompare(nodeB.parent);
        }

        if (nodeA.type === 'employee' && nodeB.type === 'default') {
            return -1;
        }
        if (nodeA.type === 'default' && nodeB.type === 'employee') {
            return 1;
        }

        if (nodeA.type === 'employee' && nodeB.type === 'employee') {
            return nodeA.original.positionOrder - nodeB.original.positionOrder;
        }
        return nodeA.text.localeCompare(nodeB.text);
    }

    function filterTreeDataByEmployee(treeData, employeeCode, employees) {
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
        const treeData = [];
        const departmentMap = {};
        const positionMap = {};
        const positionOrder = {
            'P001': 1,
            'P002': 2,
            'P004': 3,
            'P007': 4,
            'P005': 5,
            'P006': 6
        };

        positions.forEach(position => {
            if (position && position.psCd) {
                positionMap[position.psCd] = position.psNm;
            }
        });

        departments.forEach(department => {
            if (department && department.departmentId) {
                const node = {
                    id: department.departmentId,
                    text: department.departmentName,
                    parent: department.parentDepartmentId || "#",
                    children: [],
                    type: 'default',
                    li_attr: { class: 'department-node' }
                };
                departmentMap[department.departmentId] = node;
                treeData.push(node);
            }
        });

        employees.forEach(employee => {
            if (employee && employee.departmentId) {
                const positionName = positionMap[employee.psCd] || employee.psCd;
                const node = {
                    id: employee.employeeCode,
                    text: `${employee.name} (${positionName})`,
                    parent: employee.departmentId,
                    type: 'employee',
                    original: { psCd: employee.psCd },
                    positionOrder: positionOrder[employee.psCd] || 999,
                    li_attr: { class: 'employee-node' }
                };
                treeData.push(node);
            }
        });

        return treeData;
    }

    function populateDocNoDropdown(data) {
        const selectElement = document.getElementById("ap-doc-no");
        selectElement.innerHTML = '<option value="" selected>문서 선택</option>';

        if (data && Array.isArray(data.docNos)) {
            data.docNos.forEach(doc => {
                const option = document.createElement("option");
                option.value = doc.docNo;
                option.textContent = doc.docName;
                selectElement.appendChild(option);
            });
        } else {
            console.error("No document numbers available");
        }
    }
});

function removeInput(element) {
    $(element).parent().remove();
}
