package com.roadMonitoring.dashbard.Controller;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import com.roadMonitoring.dashbard.Service.DataService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
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
    public HashMap<String, List<Dataentity>> getAllData(Model model){
        //타입별로 나눠진 리스트를 담을 해쉬맵
        HashMap<String, List<Dataentity>> dataTypeMap= new HashMap<>();

        //타입이 존재하는 모든 데이터
        List<Dataentity> allData = dataService.getTypeNotEmpty();

        //방법 1 : 모든 타입이 존재하는 데이터를 받아오고 반복문으로 타입별로 나눠서 맵에 추가
        String[] type = new String[]{"crack", "pothole", "rusk", "breakage", "damagepanel"};

        for(int i = 0 ; i < type.length; i++){
            //리스트<리스트>에 더할 리스트
            List<Dataentity> addList = new ArrayList<>();
            //비교할 문자열
            String compareType = type[i];
            for(int j = 0 ; j < allData.size(); i++){
                //j번째 데이터의 타입이 i번째 비교타입과 같으면
                if(allData.get(j).getType().equals(compareType)){
                    //j번째 데이터를 더할 리스트에 추가
                    addList.add(allData.get(j));
                }
            }
            //타입이름과 해당 데이터리스트를 맵에 추가
            dataTypeMap.put(type[i], addList);
        }

        dataTypeMap.put("allData",allData);

        //방법 2 : 타입별로 쿼리를 보내서 리스트로 받아온걸 맵에 추가
//        //타입마다 나눠서 맵에 추가
//        dataTypeMap.put("crack", dataService.getType("crack")) ;
//        dataTypeMap.put("pothole", dataService.getType("pothole")) ;
//        dataTypeMap.put("rusk", dataService.getType("rusk")) ;
//        dataTypeMap.put("breakage", dataService.getType("breakage")) ;
//        dataTypeMap.put("damagedpanel", dataService.getType("damagedpanel")) ;
        //타입이 존재하는 모든 데이터 맵에 추가


        dataTypeMap.put("allType", dataService.getTypeNotEmpty());

        return dataTypeMap;
    }



    //지역구가 지정되지 않은 데이터를 갱신
    @GetMapping("/setlocal")
    @ResponseBody
    public void SetLocal(String[] idLArray, String[] areaArray , HttpServletRequest request){

        dataService.LocalUpdate(idLArray, areaArray);

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    //밑은 미사용

    //localhost:8080/type 조회시
    @GetMapping("/type")
    //반환타입은 List<Dataentity>
    public HashMap<String, List<Dataentity>> getTypeData(){

        //Service에서 특정(type이 존재하는) 값 받아오는 메서드 실행
        List<Dataentity> crackList = dataService.getType("Crack");
        List<Dataentity> potholeList = dataService.getType("Pothole");

        HashMap <String, List<Dataentity>> map = new HashMap<>();

        map.put("crack", crackList);
        map.put("pthole", potholeList);

        return map;
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






}
