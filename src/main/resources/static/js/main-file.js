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
                                    <td><input type="checkbox" class="file-checkbox" value="${item.id}"></td>
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

    // 검색 처리
    $('#fileSearchList').on('submit', function(event){
        event.preventDefault();
        const searchQuery = $('#file-search-form').val();

        $.ajax({
            url: '/file/search',
            type: 'GET',
            data: {title: searchQuery},
            dataType: 'json',
            success: function (data) {
                $('#pagination').pagination({
                    dataSource: data.searchList,
                    pageSize: 5,
                    callback: function (data, pagination) {
                        let html = '';
                        $.each(data, function (index, item) {

                            html += `<tr>
                                    <td><input type="checkbox" class="file-checkbox" value="${item.id}"></td>
                                    <td>${item.fileCd}</td>
                                    <td>${item.title}</td>
                                    <td>${item.departmentName}</td>
                                    <td></td>
                                    <td>${item.updatedAt.substring(0, 10)}</td>
                                 </tr>`;
                        });
                        $('#file-list').html(html);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error fetching data: ", textStatus, errorThrown);
            }
        });
    });

    // 문서 등록
    function submitForm() {

        var form = document.getElementById('fileRegForm');
        var formData = new FormData(form);

        fetch('/reg', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('문서가 등록되었습니다.');
                    location.reload();
                } else if (data.error) {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    $('#cancelButton').click(function() {
        $('#fileReg')[0].reset(); // 폼 초기화
    });

    // 삭제 버튼 클릭 이벤트
    $('#deleteButton').click(function() {
        let selectedId = $('.file-checkbox:checked').val();

        if (selectedId) {
            // 삭제 확인 메시지
            if (confirm("정말로 삭제하시겠습니까?")) {
                $.ajax({
                    url: '/file/delete/' + selectedId,
                    method: 'DELETE',
                    success: function(response) {
                        alert('삭제 성공');
                        // 페이지를 새로고침하여 목록을 업데이트
                        location.reload();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log("Error deleting file: ", textStatus, errorThrown);
                    }
                });
            }
        } else {
            alert('삭제할 파일을 선택하세요.');
        }
    });

});




