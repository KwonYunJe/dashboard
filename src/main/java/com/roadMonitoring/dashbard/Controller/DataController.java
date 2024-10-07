package com.roadMonitoring.dashbard.Controller;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import com.roadMonitoring.dashbard.Service.DataService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
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

    @GetMapping("/local")
    public ModelAndView Setlocal(Model model){  //데이터를 담을 모델 생성
        //Service에서 특정(type이 존재하는) 값 받아오는 메서드 실행
        List<Dataentity> dataList = dataService.getType("Crack");

        //파일명과 위도+경도 를 담을 해쉬맵
        HashMap<String, String> map = new HashMap<>();

        //해쉬맵에 값 저장
        for(int i = 0 ; i < dataList.size(); i++){
            map.put(dataList.get(i).getId(), dataList.get(i).getLatitude() + "/" + dataList.get(i).getLongitude());
        }

        System.out.println(map.toString());

        //위의 리스트를 모델에 담음
        model.addAttribute("map",map);
        //모델을 보낼 엔드포인트를 설정
        ModelAndView mav = new ModelAndView("local");
        //엔드포인트를 반환
        return mav;
    }

    @GetMapping("/setlocal")
    public String SetLocal(HttpServletRequest httpServletRequest){

        String[] files = new String[]{httpServletRequest.getParameter("file")};
        String[] locals = new String[]{httpServletRequest.getParameter("local")};

        dataService.UpdateLocal(files, locals);

        return "main";
    }




}
