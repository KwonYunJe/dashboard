package com.roadMonitoring.dashbard.Service;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import com.roadMonitoring.dashbard.Repository.DataRepo;
import com.roadMonitoring.dashbard.Repository.NameMapping;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DataService {


    //아래는 Repository 관련 메서드
    /////////////////////////////////////////////////////////////////////////////////////////////
    private final DataRepo dataRepo;

    //findAll()로 모든 데이터 받아오기, 반환타입은 List
    public List<Dataentity> getTable(){
        List<Dataentity> ll = dataRepo.findByTypeNotNull();

        System.out.println(ll.size());

        return ll;
    }

    //타입이 있는 데이터만 받아오기, 반환타입은 List
    public List<Dataentity> getType(String type){
        return dataRepo.findByType(type);
    }

    //업데이트, 지역을 셋팅해야할 데이터 리스트와 셋팅 될 지역 배열을 받음
    public void LocalUpdate(String[] idArray, String[] areaArray){
        //엔티티 리스트 생성
        List<Dataentity> up = new ArrayList<>();

        for(int i = 0 ; i < idArray.length ; i++){
            //빈 엔티티 생성
            Dataentity de = null;
            //파일명으로 데이터 한개 검색후 엔티티에 저장
            Optional<Dataentity> updateEntity = dataRepo.findById(idArray[i]);

            //검색결과가 값이 있을 경우(대부분의 경우)
            if(updateEntity.isPresent()){
                //빈 엔티티와 검색된 엔티티를 일치시킴
                de.setId(updateEntity.get().getId());
                de.setDate(updateEntity.get().getDate());
                de.setType(updateEntity.get().getType());
                de.setLongitude(updateEntity.get().getLongitude());
                de.setLatitude(updateEntity.get().getLatitude());
                //지역값을 새로 셋팅해야하니 새 값을 set,
                //위에 일치화 시킨이유는 save 했을 때 빈값(null)이 DB에도 그대로 적용되기 때문에
                de.setLocal(areaArray[i]);
            }
            //해당 엔티티 객체를 리스트에 저장
            up.add(de);
        }
        //변경된 데이터 모두 저장(Update)
        dataRepo.saveAll(up);
    }

    //아래는 일반 메서드
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


    //데이터를 타입별로 나눠서 리스트에 저장하는 메서드
    public List<List<Dataentity>> SelectType(List<Dataentity> list){
        //반환할 리스트의 리스트
        List<List<Dataentity>> typeReturn = new ArrayList<>();

        //타입별 리스트
        List<Dataentity> pothole = new ArrayList<>();
        List<Dataentity> crack = new ArrayList<>();

        for(int i = 0 ; i < list.size() ; i++){
            String entityType = list.get(i).getType();
            if(entityType.equals("Crack")){
                pothole.add(list.get(i));
            }else if(entityType.equals("Pothole")){
                crack.add(list.get(i));
            }
        }

        typeReturn.add(pothole);
        typeReturn.add(crack);

        return  typeReturn;
    }

    //지역이 def인 데이터만 골라내는 메서드
    public List<Dataentity> SelectDef(List<Dataentity> list){
        //지역이 def인 데이터만 담을 리스트
        List<Dataentity> defLocal = new ArrayList<>();

        for (Dataentity dataentity : list) {
            if (dataentity.getLocal().equals("def")) {
                defLocal.add(dataentity);
            }
        }

        return defLocal;
    }



}

