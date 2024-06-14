package com.groupware.notice.service;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.mapper.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    private static NoticeMapper noticeMapper = null;

    @Autowired
    public NoticeService(NoticeMapper noticeMapper) {
        NoticeService.noticeMapper = noticeMapper;
    }

    public List<NoticeDTO> getAllNotices() {
        return noticeMapper.getAllNotices();
    }

    // 공지사항을 등록하는 메서드
    public void addNotice(NoticeDTO noticeDTO) {
        noticeMapper.insertNotice(noticeDTO);
    }


}
