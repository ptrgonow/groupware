package com.groupware.notice.controller;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.service.NoticeService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

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

}
