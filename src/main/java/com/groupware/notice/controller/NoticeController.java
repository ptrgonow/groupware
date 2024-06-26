package com.groupware.notice.controller;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.service.NoticeService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// NoticeController.java

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

    // 공지사항 등록 처리
    @PostMapping("/submit-notice")
    public String submitNotice(@ModelAttribute NoticeDTO noticeDTO, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        noticeDTO.setEmployeeCode(user.getEmployeeCode());
        noticeService.addNotice(noticeDTO);
        return "redirect:/nt/nmain";
    }

    @GetMapping("/detail")
    public String noticeDetail(@RequestParam("id") int noticeId, Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        NoticeDTO notice = noticeService.getNoticeById(noticeId);
        model.addAttribute("notice", notice).addAttribute("user", user);
        return "notice/notice-detail";
    }

    // 수정 페이지로 이동
    @GetMapping("/update")
    public String updateNoticePage(@RequestParam("id") int noticeId, Model model) {
        NoticeDTO notice = noticeService.getNoticeById(noticeId);
        model.addAttribute("notice", notice);
        return "notice/notice-edit";
    }

    // 공지사항 수정 처리
    @PostMapping("/update-notice")
    public String updateNotice(@ModelAttribute NoticeDTO noticeDTO) {
        noticeService.updateNotice(noticeDTO);
        return "redirect:/nt/nmain";
    }

    // 공지사항 삭제 처리
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteNotice(@RequestParam("id") int noticeId) {
        try {
            noticeService.deleteNotice(noticeId);
            return ResponseEntity.ok("삭제가 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다.");
        }
    }
}




