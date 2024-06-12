package com.groupware.file.controller;

import com.groupware.file.dto.FileDTO;
import com.groupware.file.service.FileService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/fmain")
    public String file(Model model, HttpSession session) {

        List<FileDTO> fileList = fileService.selectAll();
        UserDTO user = (UserDTO) session.getAttribute("user");

        if (user != null) {
            model.addAttribute("user", user);
            model.addAttribute("departmentName", user.getDepartmentName());
        }
        model.addAttribute("fList", fileList);

        return "file/main-file";
    }

    // 검색 했을 때 보여질 페이지
    @GetMapping("/search")
    public String search(@RequestParam String search, Model model) {
        List<FileDTO> searchList = fileService.searchList();

        return "file/search-file";
    }

    @GetMapping("/vac")
    public String vac() {
        return "file/eform-draft";
    }


}
