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

    // 전체 선택 체크박스의 상태에 따라 모든 개별 체크박스를 선택하거나 해제하는 이벤트 핸들러
    $('#file-select').on('change', function() {
        $('.file-checkbox').prop('checked', this.checked);
    });

    // 만약 개별 체크박스가 모두 선택되거나 해제되었을 때, 전체 선택 체크박스의 상태를 업데이트
    $('#file-list').on('change', '.file-checkbox', function() {
        if ($('.file-checkbox:checked').length === $('.file-checkbox').length) {
            $('#file-select').prop('checked', true);
        } else {
            $('#file-select').prop('checked', false);
        }
    });

    // 검색 처리
    $('#fileSearchList').on('submit', function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음
        const searchQuery = $('#file-search-form').val();

        $.ajax({
            url: '/file/search',
            type: 'GET',
            data: { title: searchQuery },
            dataType: 'json',
            success: function(data) {
                if (data.searchList.length > 0) {
                    $('#pagination').show().pagination({
                        dataSource: data.searchList,
                        pageSize: 5,
                        callback: function(data, pagination) {
                            let html = '';
                            $.each(data, function(index, item) {
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
                } else {
                    $('#file-list').html('<tr><td colspan="6">해당문서가 존재하지 않습니다.</td></tr>');
                    $('#pagination').hide(); // 페이징 요소 숨기기
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error fetching data: ", textStatus, errorThrown);
                console.log(jqXHR.responseText);
            }
        });
    });

    // 문서 등록하기 버튼 클릭 시
    $('#fileRegForm').submit(function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음

        // 필수 입력값
        const fileCd = $('#fileCd').val().trim();
        const title = $('#title').val().trim();
        const departmentName = $('#departmentSelect').val().trim();

        // 입력값 유효성 검사
        if (!fileCd) {
            alert('문서번호를 입력하세요.');
            $('#fileCd').focus();
            return false;
        }
        if (!title) {
            alert('결재 양식명을 입력하세요.');
            $('#title').focus();
            return false;
        }
        if (!departmentName) {
            alert('결재 담당 부서를 선택하세요.');
            $('#departmentSelect').focus();
            return false;
        }

        // 폼 데이터 생성
        var form = $(this);
        var formData = new FormData(this);

        // AJAX 요청
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.success) {
                    alert('문서가 등록되었습니다.');
                    location.reload();
                } else {
                    alert('이미 등록된 문서번호입니다.');
                    $('#fileCd').val('');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });

    // 취소 버튼 클릭 시 작성한 내용 리셋
    $('#cancelButton').click(function() {
        $('#fileRegForm')[0].reset();
    });

    // 삭제 버튼 클릭 시
    $('#deleteButton').click(function() {
        let selectedIds = $('.file-checkbox:checked').map(function() {
            return $(this).val();
        }).get();

        if (selectedIds.length > 0) {
            if (confirm("정말로 삭제하시겠습니까?")) {
                $.ajax({
                    url: '/file/delete',
                    method: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify(selectedIds),
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




