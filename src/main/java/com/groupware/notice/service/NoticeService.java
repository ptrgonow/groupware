package com.groupware.notice.service;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.mapper.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    private final NoticeMapper noticeMapper;

    @Autowired
    public NoticeService(NoticeMapper noticeMapper) {
        this.noticeMapper = noticeMapper;
    }

    public List<NoticeDTO> getAllNotices() {
        return noticeMapper.getAllNotices();
    }

    // 공지사항을 등록하는 메서드
    public void addNotice(NoticeDTO noticeDTO) {
        noticeMapper.insertNotice(noticeDTO);
    }

    // 공지사항 수정
    public void updateNotice(NoticeDTO noticeDTO) {
        noticeMapper.updateNotice(noticeDTO);
    }

    // 공지사항 삭제
    public void deleteNotice(int id) {
        noticeMapper.deleteNotice(id);
    }

    // 공지사항 상세 조회
    public NoticeDTO getNoticeById(int noticeId) {
        return noticeMapper.getNoticeById(noticeId);
    }
}
