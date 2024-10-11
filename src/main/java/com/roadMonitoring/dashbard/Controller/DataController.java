package com.roadMonitoring.dashbard.Controller;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import com.roadMonitoring.dashbard.Service.DataService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/data")
@RestController
public class DataController {

    private  final DataService dataService;

    //비동기 local부분 업데이트
    @PostMapping("/fetch")
    @ResponseBody
    public void fetch(@RequestParam(required = false) String[] locals,@RequestParam(required = false) String[] ids){

            // locals 배열 처리
        for (int i = 0; i < locals.length; i++) {
            String result = locals[i].replaceAll("[\"\\[\\]]", "");
            locals[i] = result;
        }
        // ids 배열 처리
        for (int i = 0; i < ids.length; i++) {
            String result = ids[i].replaceAll("[\"\\[\\]]", "");
            ids[i] = result;
        }
        dataService.LocalUpdate(ids, locals);
    }

    //비동기 특정 타입 반환
    @PostMapping("/type")
    @ResponseBody
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

    //localhost:8080/data/table 조회시
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

        List<Dataentity> list = dataService.selecttypeAndLocal("def");
        List<Dataentity> list2 = dataService.selecttypeAndLocal("def");

        for(int i = 0 ; i < list.size() ; i++){
            if(list.get(i).getType().isEmpty()){
                list2.add(list.get(i));
            }
        }

        dataService.update(list2);
//        //String[] files = new String[]{httpServletRequest.getParameter("file")};
//        String[] files = new String[]{"G_A_V_04_0901120915653.jpg", "G_C_V_06_1022172106363.jpg", "H_C_F_03_0906151551731.jpg"};
//        //String[] locals = new String[]{httpServletRequest.getParameter("local")};
//        String[] locals = new String[]{"으히히", "으히히", "으히히"};
//
//        dataService.UpdateLocal(files[0], locals[0]);

        return "main";
    }




}
