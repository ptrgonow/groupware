$(document).ready(function() {

    editor();
    $("#notice-btn").on("click", function(e) {
        if(checkValue() === false){
            e.preventDefault();
            window.location.reload();
        }
    });
});

function editor() {
    CKEDITOR.replace('editor', {
        enterMode: CKEDITOR.ENTER_BR, // 줄 바꿈 시 <br> 태그 사용
        shiftEnterMode: CKEDITOR.ENTER_P // Shift + Enter 시 <p> 태그 사용하지 않음
    });
}

function checkValue() {
    const editorValue = CKEDITOR.instances.editor.getData();

    if (editorValue === '') {
        alert('내용을 입력하세요.');
        return false;
    }
    return true;
}
