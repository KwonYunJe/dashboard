package com.roadMonitoring.dashbard.Controller;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.standard.expression.Each;

import java.util.*;

@RequestMapping("/index")
@Controller
public class IndexController {

    @GetMapping("/a")
    public String index(){
        return "dashboard_style.html";
    }

    @PostMapping("/fetch")
    @ResponseBody
    public void fetch(@RequestParam String[] locals,@RequestParam String[] ids){
        for (int i = 0; i < locals.length; i++){
            String result = locals[i].replaceAll("[\"\\[\\]]", "");
            locals[i] = result;
        }

        for (int i = 0 ; i < ids.length ; i++){
            String result = ids[i].replaceAll("[\"\\[\\]]", ""); // 큰따옴표와 대괄호 제거
            ids[i] = result;
        }

        System.out.println(locals[0]+ids[0]);

    }
}
