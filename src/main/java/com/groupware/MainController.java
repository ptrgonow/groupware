package com.groupware;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.service.NoticeService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@Controller
@AllArgsConstructor
public class MainController {

    private final NoticeService noticeService;


    @GetMapping("/")
    public String index(Model model, HttpSession session) {

        UserDTO user = (UserDTO) session.getAttribute("user");
        List<NoticeDTO> nDTO = noticeService.getAllNotices();

        if (user != null) {
            model.addAttribute("user", user);
            model.addAttribute("employeeCode", user.getEmployeeCode());
            model.addAttribute("departmentId", user.getDepartmentId());
            model.addAttribute("nList", nDTO);
        } else {
            return "redirect:/loginPage";
        }

        return "index";
    }

    @GetMapping("/no")
    public String error(HttpServletResponse response) throws IOException {

        response.setContentType("text/html; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        out.println("<script>alert('로그인이 필요한 서비스입니다.'); location.href='/';</script>");

        return null;
    }
}
