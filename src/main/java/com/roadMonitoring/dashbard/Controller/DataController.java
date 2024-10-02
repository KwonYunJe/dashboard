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
        ArrayList<Dataentity> list = ShowData(dataList);
        //필터링된 데이터 (ArrayList) 반환
        return list;
    }

    //ArrayList반환, 매개변수는 DB의 모든데이터가 담긴 List
    public ArrayList<Dataentity> ShowData(List<Dataentity> dataentityList){

        //도로가 불량인 데이터를 담을 ArrayList
        ArrayList<Dataentity> list = new ArrayList<>();

        //반복문으로 type이 비어있지 않은 데이터만 ArrayList에 추가
        for(int i = 0 ; i < dataentityList.size(); i++){
            if(!dataentityList.get(i).getType().isEmpty()){
                list.add(dataentityList.get(i));
            }
        }

        //불량이 데이터 개수 출력
        //System.out.println(list.size());

        //필터링된 ArrayList 반환
        return list;
    }
}
