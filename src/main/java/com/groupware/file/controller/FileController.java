package com.groupware.file.controller;

import com.groupware.file.dto.FileDTO;
import com.groupware.file.service.FileService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/flist")
    public ResponseEntity<Map<String, Object>> getFileList(HttpSession session) {

        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<FileDTO> fileList = fileService.selectAll();

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("departmentName", user.getDepartmentName());
        response.put("fileList", fileList);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 검색 했을 때 보여질 요청
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam String title, HttpSession session) {
        List<FileDTO> searchList = fileService.searchList(title);

        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("departmentName", user.getDepartmentName());
        response.put("searchList", searchList);

        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    // 문서 등록하기 버튼을 클릭했을 때 페이지
    @PostMapping("/reg")
    public String reg(Model model, HttpSession session,
                      @RequestParam("title") String title,
                      @RequestParam("fileUrl") String fileUrl){

        UserDTO user = (UserDTO) session.getAttribute("user");

        if (user != null) {
            model.addAttribute("user", user);
            model.addAttribute("departmentName", user.getDepartmentName());
        }

        return "file/file-reg";
    }

    @GetMapping("/vac")
    public String vac() {
        return "file/eform-draft";
    }


}
