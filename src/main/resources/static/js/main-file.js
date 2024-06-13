$(document).ready(function(){
    $.ajax({
        url: '/file/flist',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            $('#pagination').pagination({
                dataSource: data.fileList,
                pageSize: 5,
                callback: function (data, pagination) {
                    let html = '';
                    $.each(data, function(index, item) {

                        html += `<tr>
                                    <td><input type="checkbox"></td>
                                    <td>${item.fileCd}</td>
                                    <td>${item.title}</td>
                                    <td>${item.departmentName}</td>
                                    <td></td>
                                    <td>${item.updatedAt.substring(0,10)}</td>
                                 </tr>`;
                    });
                    $('#file-list').html(html);
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error fetching data: ", textStatus, errorThrown);
        }
    });
});

// 검색처리
$(document).ready(function(){
    $('#fileSearchList').on('submit', function(event){
        event.preventDefault();
        const searchQuery = $('#file-search-form').val();

        $.ajax({
            url: '/file/search',
            type: 'GET',
            data: { title: searchQuery },
            dataType: 'json',
            success: function(data){
                let html = '';
                $.each(data.searchList, function(index, item) {

                    html += `<tr>
                                <td><input type="checkbox"></td>
                                <td>${item.fileCd}</td>
                                <td>${item.title}</td>
                                <td>${item.departmentName}</td>
                                <td></td>
                                <td>${item.updatedAt.substring(0,10)}</td>
                             </tr>`;
                });
                $('#file-list').html(html);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error fetching data: ", textStatus, errorThrown);
            }
        });
    });
});
