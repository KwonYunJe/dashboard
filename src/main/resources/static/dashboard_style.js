//////////////////////////////////////////////////////////////////////////////////fetch//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////fetch//////////////////////////////////////////////////////////////////////////////////////
let crackList = [];
let ptholeList = [];
fetch('/data/type', { //요청경로
  method: 'POST',
  cache: 'no-cache',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  //컨트롤러로 전달할 데이터
  body: new URLSearchParams({
    // 데이터명 : 데이터값

  })
})
  .then((response) => {
    if (!response.ok) {
      alert('fetch error!\n컨트롤러로 통신중에 오류가 발생했습니다.');
      return;
    }

    //return response.text(); //컨트롤러에서 return하는 데이터가 없거나 int, String 일 때 사용
    return response.json(); //나머지 경우에 사용
  })
  //fetch 통신 후 실행 영역
  .then((data) => {//data -> controller에서 리턴되는 데이터!
    for (let i = 0; i < data.crack.length; i++) {
      crackList.push(data.crack[i]);
    }

    for (let i = 0; i < data.pthole.length; i++) {
      ptholeList.push(data.pthole[i]);
    }

    /////////////////////////////////////////////////////////////////////////////////////map//////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////map//////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////map//////////////////////////////////////////////////////////////////////////
    //지도를 담을 영역의 DOM 레퍼런스
    var container = document.getElementById('map');
    //지도를 생성할 때 필요한 기본 옵션
    var options = {
      center: new kakao.maps.LatLng(35.5395907552704, 129.3115702368008), //지도의 중심좌표.
      level: 15 //지도의 레벨(확대, 축소 정도)
    };
    //지도 생성 및 객체 리턴
    var map = new kakao.maps.Map(container, options);

    // 마커를 표시할 위치와 title 객체 배열입니다 

    //마커 추가
    let markerList = [];

    for(let i = 0 ; i < crackList.length; i++){
      markerList.push({latlng: new kakao.maps.LatLng(crackList[i].latitude, crackList[i].longitude)})
    }

    var markerPositions = markerList;

    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (var i = 0; i < markerPositions.length; i++) {

      // 마커 이미지의 이미지 크기 입니다
      var imageSize = new kakao.maps.Size(24, 35);

      // 마커 이미지를 생성합니다    
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: markerPositions[i].latlng, // 마커를 표시할 위치
        title: markerPositions[i].title // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      });
    }
    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);











  })
  //fetch 통신 실패 시 실행 영역
  .catch(err => {
    alert('fetch error!\nthen 구문에서 오류가 발생했습니다.\n콘솔창을 확인하세요!');
    console.log(err);
  });
//////////////////////////////////////////////////////////////////////////////////fetch//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////fetch//////////////////////////////////////////////////////////////////////////////////////

let coordinates = [
  { lat: 35.5, lng: 129.3 },
  { lat: 35.6, lng: 129.4 },
  { lat: 35.4, lng: 129.2 }
  // 추가 좌표를 여기에 넣을 수 있습니다.
];
let locals = [];
let currentIndex = 0;

getAddr(coordinates[currentIndex]);

function getAddr(coord) {
  let geocoder = new kakao.maps.services.Geocoder();
  let position = new kakao.maps.LatLng(coord.lat, coord.lng);
  let callback = function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      console.log(result[0].address.region_2depth_name);
      locals.push(result[0].address.region_2depth_name);

      // 다음 좌표로 이동
      currentIndex++;
      if (currentIndex < coordinates.length) {
        getAddr(coordinates[currentIndex]);
      } else {
        localPlusFun(); // 모든 좌표에 대한 요청이 끝난 후 실행
      }
    } else {
      console.error('Geocoder failed due to: ' + status);
    }
  }

  geocoder.coord2Address(position.getLng(), position.getLat(), callback);
};

function localPlusFun() {

  fetch('/index/fetch', { //요청경로
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    //컨트롤러로 전달할 데이터
    body: new URLSearchParams({
      // 데이터명 : 데이터값
      'local': JSON.stringify(locals)
    })
  })
    .then((response) => {
      if (!response.ok) {
        alert('fetch error!\n컨트롤러로 통신중에 오류가 발생했습니다.');
        return;
      }

      return response.text(); //컨트롤러에서 return하는 데이터가 없거나 int, String 일 때 사용
      //return response.json(); //나머지 경우에 사용
    })
    //fetch 통신 후 실행 영역
    .then((data) => {//data -> controller에서 리턴되는 데이터!

    })
    //fetch 통신 실패 시 실행 영역
    .catch(err => {
      alert('fetch error!\nthen 구문에서 오류가 발생했습니다.\n콘솔창을 확인하세요!');
      console.log(err);
    });

};

//================================================================================chart======================================================================================
//================================================================================chart======================================================================================
//================================================================================chart======================================================================================

// 우선도별 원형 그래프 생성
var priorityCtx = document.getElementById('priorityPieChart');
var priorityPieChart = new Chart(priorityCtx, {
  type: 'doughnut',
  data: {
    labels: ['crack', 'pothole', 'rust', 'breakage', 'rust_volt', 'empty'],
    datasets: [{
      data: [12, 5, 8, 7, 4, 2], // 각 우선도별 항목 수
      backgroundColor: ['#ff6384', '#ffcc00', '#36a2eb', '#4bc0c0', '#9966ff', '#ff9f40'],
      borderWidth: 0
    }]
  },
  options: {
    cutoutPercentage: 60, //도넛 중앙 공간 크기 설정
    rotation: 1 * Math.PI, //방향
    circumference: 1 * Math.PI, //도넛차트 부분 각도 설정
    legend: {
      display: true, // 범례 표시 여부
      position: 'top',
      labels: {
        padding: 15, // 범례와 차트 사이의 간격 설정 (값을 조정하여 간격 조절)
        boxWidth: 10 // 범례 색상 박스 크기 조절
      }
    }
  }
});

// 지역별 원형 그래프 생성
var regionCtx = document.getElementById('regionPieChart');
var regionPieChart = new Chart(regionCtx, {
  type: 'doughnut',
  data: {
    labels: ['남구', '동구', '중구', '북구', '울주군'],
    datasets: [{
      data: [100, 20, 50, 60, 35],
      backgroundColor: [
        '#ff6384', '#36a2eb', '#ffcc00', '#4bc0c0', '#9966ff'
      ],
      borderWidth: 0
    }]
  },
  options: {
    cutoutPercentage: 60, //도넛 중앙 공간 크기 설정
    rotation: 1 * Math.PI, //방향
    circumference: 1 * Math.PI, //도넛차트 부분 각도 설정(반원)
    legend: {
      display: true, // 범례 표시 여부
      position: 'top',
      labels: {
        padding: 15, // 범례와 차트 사이의 간격 설정 (값을 조정하여 간격 조절)
        boxWidth: 25 // 범례 색상 박스 크기 조절
      }
    }
  }
});


// 라인 차트 생성
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
      {
        label: '도로 추세',
        data: [10, 15, 8, 12, 20, 30, 20, 6, 12, 14, 20, 15],
        borderColor: 'skyblue',
        fill: false
      },
      {
        label: '가드레일 추세',
        data: [5, 10, 5, 9, 15, 25, 18, 8, 10, 12, 18, 12],
        borderColor: 'orange',
        fill: false
      },
      {
        label: '교통표지판 추세',
        data: [7, 12, 9, 14, 18, 22, 17, 10, 11, 13, 17, 10],
        borderColor: 'green',
        fill: false
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    legend: {
      display: true, // 범례 표시 여부
      position: 'top',
      labels: {
        padding: 20, // 범례와 차트 사이의 간격 설정 (값을 조정하여 간격 조절)
        boxWidth: 30 // 범례 색상 박스 크기 조절
      }
    }
  }
});