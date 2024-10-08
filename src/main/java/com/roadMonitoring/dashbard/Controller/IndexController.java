package com.roadMonitoring.dashbard.Controller;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.standard.expression.Each;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RequestMapping("/index")
@Controller
public class IndexController {

    @GetMapping("/a")
    public String index(){
        return "dashboard_style.html";
    }

    @PostMapping("/fetch")
    @ResponseBody
    public void fetch(@RequestParam List<String> local){
        for(String e : local){
            System.out.println(e);
        }
    }
}
