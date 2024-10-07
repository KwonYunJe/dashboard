package com.roadMonitoring.dashbard.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="metadata_with_predictions")
@Getter
@Setter
public class NameSpotEntity {
    @Id //기본키를 의미. 반드시 기본키를 가져야 함
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "filename")  //아래 변수명과 컬럼명이 다를경우 해주는 매칭
    private String id;          //DB 파일명
    private String latitude;    //위도
    private String longitude;   //경도
    private String type;        //불량 타입
}
