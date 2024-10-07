package com.roadMonitoring.dashbard.Service;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import com.roadMonitoring.dashbard.Repository.DataRepo;
import com.roadMonitoring.dashbard.Repository.NameMapping;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataService {

    private final DataRepo dataRepo;

    //findAll()로 모든 데이터 받아오기, 반환타입은 List
    public List<Dataentity> getTable(){
        return dataRepo.findAll();
    }

    //타입이 있는 데이터만 받아오기, 반환타입은 List
    public List<Dataentity> getType(String type){
        return dataRepo.findByType(type);
    }

    //지역 업데이트
    public void updateLocal(String type){
        String local = "def";
        List<NameMapping> nullLocal = dataRepo.findByLocal(local);
    }




    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

    //업데이트
    public void UpdateLocal(String[] id, String[] local){
        for(int i = 0 ; i < id.length ;  i++){
            Dataentity dataentity = dataRepo.findById(id[0]).get();
            dataentity.setLocal(local[i]);
            dataRepo.save(dataentity);
        }
    }
}

