package com.groupware.file.service;


import com.groupware.file.dto.FileDTO;
import com.groupware.file.mapper.FileMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileService {

    private final FileMapper fileMapper;

    @Autowired
    public FileService(FileMapper fileMapper) {
        this.fileMapper = fileMapper;
    }

    public List<FileDTO> selectAll() {
        return fileMapper.selectAll();
    }

    public List<FileDTO> searchList(String title){
        return fileMapper.searchList(title);
    }

    public void insertFile(FileDTO file) {
        fileMapper.insertFile(file);
    }


    public boolean existFileCd(String fileCd) {
        return fileMapper.existFileCd(fileCd);
    }

    public boolean existFileTitle(String title) {
        return fileMapper.existFileTitle(title);
    }

    public String checkFileDuplication(String fileCd, String title) {
        if (existFileCd(fileCd)) {
            return "이미 등록된 문서번호입니다.";
        }
        if (existFileTitle(title)) {
            return "이미 등록된 문서명입니다.";
        }
        return null; // 중복이 없는 경우
    }


    public void deleteFile(int id) {
        fileMapper.deleteFile(id);
    }
}
