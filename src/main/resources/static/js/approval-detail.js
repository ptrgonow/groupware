let editorInstance;

$(document).ready(function () {
    initializeEditor();
    initializeEventListeners();
});

// 에디터 초기화
function initializeEditor() {
    ClassicEditor
        .create(document.querySelector('#ap-editor'), {
            removePlugins: ['Heading'],
            language: 'ko',
            toolbar: [], // 툴바 비활성화
        })
        .then(editor => {
            editorInstance = editor;
            editor.enableReadOnlyMode('read-only-lock');
            $('style').append('.ck-content { height: 600px; }');
            updateEditorContent();
        })
        .catch(error => {
            console.error(error);
        });
}

// 에디터의 내용을 업데이트
function updateEditorContent(format, data) {
    const content = $('#ap-content').val() || '내용 정보 없음';

    const editorContent = `
        ${content}
    `;

    if (editorInstance) {
        editorInstance.setData(editorContent, data);
    }
}

// 이벤트 리스너 초기화
function initializeEventListeners() {
    $('#ap-submit-btn').on('click', function (event) {
        event.preventDefault();
        submitApproval();
    });

    $('#cs-submit-btn').on('click', function (event) {
        event.preventDefault();
        submitConsensus();
    });
}

// 결재 제출 함수
function submitApproval() {
    var approvalId = $('#approvalId').val();
    var employeeCode = $('#employeeCode').val();
    var newStatus = "결재";

    $.ajax({
        type: "POST",
        url: "/approval/update/approvalstatus",
        contentType: "application/json",
        data: JSON.stringify({ approvalId: approvalId, employeeCode: employeeCode, newStatus: newStatus }),
        success: function(response) {
            alert("결재가 완료되었습니다.");
            window.location.href = "/ap/amain";

        },
        error: function(error) {
            alert("결재에 실패하였습니다.");
        }
    });
}

// 합의 제출 함수
function submitConsensus() {
    var approvalId = $('#approvalId').val();
    var employeeCode = $('#employeeCode').val();
    var newStatus = "합의";

    $.ajax({
        type: "POST",
        url: "/approval/update/consensusstatus",
        contentType: "application/json",
        data: JSON.stringify({ approvalId: approvalId, employeeCode: employeeCode, newStatus: newStatus }),
        success: function(response) {
            alert("합의가 완료되었습니다.");
            window.location.href = "/ap/amain";
        },
        error: function(error) {
            alert("합의에 실패하였습니다.");
        }
    });
}
