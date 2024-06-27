import {
    ClassicEditor,
    AccessibilityHelp,
    Alignment,
    AutoLink,
    Autosave,
    BlockQuote,
    Bold,
    Code,
    CodeBlock,
    Essentials,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    Indent,
    IndentBlock,
    Italic,
    Link,
    Paragraph,
    SelectAll,
    SourceEditing,
    Strikethrough,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    Underline,
    Undo
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ko.js';

const editorConfig = {
    toolbar: {
        items: [
        ],
    },
    plugins: [
        AccessibilityHelp, Alignment, AutoLink, Autosave, BlockQuote, Bold, Code, CodeBlock, Essentials,
        GeneralHtmlSupport, HorizontalLine, HtmlComment, HtmlEmbed, Indent, IndentBlock, Italic, Link,
        Paragraph, SelectAll, SourceEditing, Strikethrough, Table, TableCaption, TableCellProperties,
        TableColumnResize, TableProperties, TableToolbar, Underline, Undo, FontColor, FontFamily, FontSize,
    ],
    fontFamily: {
        supportAllValues: true
    },
    fontSize: {
        options: [10, 12, 14, 'default', 18, 20, 22],
        supportAllValues: true
    },
    htmlSupport: {
        allow: [
            {
                name: /^.*$/,
                styles: true,
                attributes: true,
                classes: true
            }
        ]
    },
    language: 'ko',
    link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
            toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                    download: 'file'
                }
            }
        }
    },
    placeholder: 'Type or paste your content here!',
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    },
    translations: [translations]
};




let editorInstance;

$(document).ready(function () {
    initializeEditor();
    initializeEventListeners();
});

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

    $('#ap-reject-btn').on('click', function (event) {
        event.preventDefault();
        const approvalId = $('#approvalId').val();
        rejectApproval(approvalId);
    });
}

// 에디터 초기화
function initializeEditor() {
    ClassicEditor
        .create(document.querySelector('#ap-editor'), editorConfig)
        .then(editor => {
            editorInstance = editor;
            editor.enableReadOnlyMode('read-only-lock');
            $('style').append('.ck-content { height: 900px; }');
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


function rejectApproval(approvalId) {
    $.ajax({
        type: "POST",
        url: "/approval/reject",
        data: { approvalId: approvalId },
        success: function (response) {
            alert("결재가 반려되었습니다.");
            window.location.href = "/ap/amain";
        },
        error: function (error) {
            alert("반려 중 오류가 발생했습니다: " + error.responseText);
        }
    });
}
