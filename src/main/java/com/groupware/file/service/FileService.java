package com.groupware.file.service;

import com.groupware.file.mapper.FileMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileService {

    private final FileMapper fileMapper;


    @Autowired
    public FileService(FileMapper fileMapper) {
        this.fileMapper = fileMapper;
    }


}
