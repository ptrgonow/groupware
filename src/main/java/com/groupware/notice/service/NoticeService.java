package com.groupware.notice.service;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.mapper.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    public void addNotice(NoticeDTO noticeDTO) {
        noticeDTO.setCreated_at(LocalDateTime.now());
        noticeMapper.insertNotice(noticeDTO);
    }

    public void updateNotice(NoticeDTO noticeDTO) {
        noticeMapper.updateNotice(noticeDTO);
    }
    


    public NoticeDTO getNoticeById(int noticeId) {
        return noticeMapper.getNoticeById(noticeId);
    }


    // 삭제 메소드 추가
    public void deleteNotice(int noticeId) {
        noticeMapper.deleteNotice(noticeId);
    }





}
