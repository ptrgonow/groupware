$(document).ready(function(){
    $.ajax({
        url: '/file/fmain',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function(data){
            $('#file-list').pagination({
                dataSource: data,
                pageSize: 5,
                callback: function (data, pagination) {
                    let html = '';
                    $.each(data, function(index, item) {
                        html += '<tr>`\n' +
                                '    <td><input type="checkbox"></td>\n' +
                                '    <td>${item.fileCd}</td>\n' +
                                '    <td>${item.title}</td>\n' +
                                '    <td>${item.departmentName}"></td>\n' +
                                '    <td>${item.updatedAt.substring(0,10)}</td>\n' +
                            '     </tr>';
                    });
                }
            });
        }
    });
});

/*
$('#file-list').pagination({
    dataSource: [],
    pageSize: 5,
    autoHidePrevious: true,
    autoHideNext: true,
    callback: function(data, pagination) {
    // html 템플릿 넣기
        const html = '';
        $.each(data, function (index, item) {
            html += `'<tr>`\n' +
                                '    <td><input type="checkbox" th:value="${dto.fileCd}"></td>\n' +
                                '    <td th:text="${dto.fileCd}"></td>\n' +
                                '    <td th:text="${dto.title}"></td>\n' +
                                '    <td th:text="${dto.departmentName}"></td>\n' +
                                '    <td th:text="${dto.updatedAt.substring(0,10)}"></td>\n' +
                            '     </tr>'
        })
}
})
*/
