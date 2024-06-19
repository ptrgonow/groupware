function deleteNotice(noticeId) {
    if (confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
        // 삭제를 위한 AJAX 요청
        fetch('/nt/delete?id=' + noticeId, {
            method: 'DELETE'  // DELETE 메서드 사용
        }).then(response => {
            if (response.ok) {
                // 삭제 성공 시 페이지 이동
                location.href = '/nt/nmain';  // main-notice.html 경로에 맞게 수정
            } else {
                alert('삭제에 실패했습니다.');
            }
        }).catch(error => {
            console.error('삭제 요청 중 오류 발생:', error);
            alert('삭제 요청 중 오류가 발생했습니다.');
        });
    }
}
