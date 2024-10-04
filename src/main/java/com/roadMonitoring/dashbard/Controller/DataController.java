package com.roadMonitoring.dashbard.Controller;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import com.roadMonitoring.dashbard.Service.DataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/")
@RestController
public class DataController {

    private  final DataService dataService;

    //localhost:8080/table 조회시
    @GetMapping("/table")
    //반환타입은 ArrayList<Dataentity>
    public ArrayList<Dataentity> getAllData(){
        //Service에서 모든 값 받아오는 메서드 실행
        List<Dataentity> dataList = dataService.getTable();
        //아래 메서드에서 불량이 존재하지 않는 데이터 필터링
        ArrayList<Dataentity> list = dataService.ShowData(dataList);
        //필터링된 데이터 (ArrayList) 반환
        System.out.println(list.size());
        return list;
    }

    //localhost:8080/crack 조회시
    @GetMapping("/crack")
    //반환타입은 List<Dataentity>
    public List<Dataentity> getTypeData(){
        //Service에서 특정(type이 존재하는) 값 받아오는 메서드 실행
        List<Dataentity> dataList = dataService.getType("Crack");
        return dataList;
    }

//    @GetMapping("/local")
//    public ArrayList<Dataentity> Setlocal(){
//        //Service에서 특정(type이 존재하는) 값 받아오는 메서드 실행
//        List<Dataentity> dataList = dataService.getType("Crack");
//
//
//    }




}
