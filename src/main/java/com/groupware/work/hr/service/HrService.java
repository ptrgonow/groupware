package com.groupware.work.hr.service;

import com.groupware.work.hr.dto.TodayWorkerDTO;
import com.groupware.work.hr.mapper.HrMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrService {

   private final HrMapper hrMapper;

    @Autowired
    public HrService(HrMapper hrMapper){
        this.hrMapper = hrMapper;
    }

    public List<TodayWorkerDTO> getAllTodayWorkers() {

        return hrMapper.getTodayWorkers();
    }
}
