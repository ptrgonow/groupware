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

    public void addNotice(NoticeDTO noticeDTO) {
        noticeDTO.setContent(noticeDTO.getContent());
        noticeMapper.insertNotice(noticeDTO);
    }
}
