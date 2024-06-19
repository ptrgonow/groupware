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

    public void deleteFile(int id) {
        fileMapper.deleteFile(id);
    }
}
