package com.groupware.file.controller;

import com.groupware.file.dto.FileDTO;
import com.groupware.file.mapper.FileMapper;
import com.groupware.file.service.FileService;
import com.groupware.user.dto.DeptDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.apache.catalina.User;
import org.apache.catalina.filters.ExpiresFilter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;
    private final UserService userService;

    public FileController(FileService fileService, UserService userService, FileMapper fileMapper) {
        this.fileService = fileService;
        this.userService = userService;
    }

    @GetMapping("/fmain")
    public String file(Model model, HttpSession session) {

        List<FileDTO> fileList = fileService.selectAll();
        List<DeptDTO> deptList = userService.getAllDepartments();
        UserDTO user = (UserDTO) session.getAttribute("user");

        if (user != null) {
            model.addAttribute("user", user);
        }
        model.addAttribute("fList", fileList);
        model.addAttribute("dList", deptList);

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
        response.put("departmentName", userService.getAllDepartments());
        response.put("fileList", fileList);

        return ResponseEntity.ok(response);
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
        response.put("departmentName", userService.getAllDepartments());
        response.put("searchList", searchList);

        return ResponseEntity.ok(response);

    }

    // 부서 이름 가져오기
    @GetMapping("/departments")
    public ResponseEntity<List<DeptDTO>> getDepartments() {
        List<DeptDTO> deptList = userService.getAllDepartments();
        return ResponseEntity.ok(deptList);
    }

    // 문서 등록하기 버튼을 클릭했을 때
    @PostMapping("/reg")
    public ResponseEntity<Map<String, Object>> reg(@RequestParam String fileCd,
                                                   @RequestParam String title,
                                                   @RequestParam String department_name,
                                                   HttpSession session) {

        List<DeptDTO> deptList = userService.getAllDepartments();
        UserDTO user = (UserDTO) session.getAttribute("user");

        // 문서 번호 존재 확인 여부
        boolean isFileExists = fileService.existFileCd(fileCd);
        if(isFileExists) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            return ResponseEntity.ok(response);
        }

        FileDTO file = new FileDTO();
        file.setTitle(title);
        file.setFileCd(fileCd);
        file.setCreatedBy(department_name);

        fileService.insertFile(file);

        Map<String, Object> response = new HashMap<>();
        response.put("deptList", deptList);
        response.put("success", true);

        return ResponseEntity.ok(response);
    }

    // 문서 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(@RequestBody List<Integer> ids) {
        for (Integer id : ids) {
            fileService.deleteFile(id);
        }

        return ResponseEntity.ok("삭제 성공");
    }


    @GetMapping("/vac")
    public String vac() {
        return "file/eform-draft";
    }

}
