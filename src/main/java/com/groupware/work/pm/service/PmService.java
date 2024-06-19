package com.groupware.work.pm.service;

import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.pm.mapper.PmMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PmService {

    private final PmMapper pmMapper;

    @Autowired
    public PmService(PmMapper pmMapper) {
        this.pmMapper = pmMapper;
    }

    public List<ProjectDTO> getProjects(){
        return pmMapper.getProjects();
    }
}
