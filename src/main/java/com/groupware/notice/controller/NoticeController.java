package com.groupware.notice.controller;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.service.NoticeService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/nt")
public class NoticeController {

    private final NoticeService noticeService;

    @Autowired
    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping("/writepage")
    public String noticeWrite() {
        return "notice/notice-write";
    }

    @GetMapping("/nmain")
    public String noticeList(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        List<NoticeDTO> notices = noticeService.getAllNotices();
        model.addAttribute("user", user);
        model.addAttribute("notices", notices);
        return "notice/main-notice";
    }
    @PostMapping("/submit-notice")
    public String submitNotice(@ModelAttribute NoticeDTO noticeDTO) {
        // 여기서 NoticeDTO 객체를 받아서 Service를 통해 저장하는 로직을 추가해야 합니다.
        noticeService.addNotice(noticeDTO);
        return "redirect:/nt/nmain"; // 등록 후 목록 페이지로 리다이렉트
    }

    @GetMapping("/detail")
    public String noticeDetail(@RequestParam("id") int noticeId, Model model) {
        NoticeDTO notice = noticeService.getNoticeById(noticeId);
        model.addAttribute("notice", notice);
        return "notice/notice-detail";
    }


}
