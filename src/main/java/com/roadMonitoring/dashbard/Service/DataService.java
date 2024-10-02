package com.roadMonitoring.dashbard.Service;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import com.roadMonitoring.dashbard.Repository.DataRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DataService {
    private final DataRepo dataRepo;

    //findAll()로 모든 데이터 받아오기, 반환타입은 List
    public List<Dataentity> getTable(){
        return dataRepo.findAll();
    }
}

