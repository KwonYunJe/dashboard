//////////////////////////////////////////////////////////////////////////////////fetch//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////fetch//////////////////////////////////////////////////////////////////////////////////////
let crackList = [];
let ptholeList = [];
let rustList = [];
let breakageList = [];
let damagedPanelList = [];
let locals = [];
let isLocalIsDefIds = [];
let roadMarkerList = [];
let guardRailMarkerList = [];
let panelMarkerList = [];
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
    console.log(data);
    for (let i = 0; i < data.allType.length; i++) {
      if (data.allType[i].type == "Crack") {
        crackList.push(data.allType[i]);
        if (data.allType[i].local == "def") {
          isLocalIsDefIds.push(data.allType[i].id);
        }
      }
      if (data.allType[i].type == "Pothole") {
        ptholeList.push(data.allType[i]);
        if (data.allType[i].local == "def") {
          isLocalIsDefIds.push(data.allType[i].id);
        }
      }
      if (data.allType[i].type == "Rust") {
        rustList.push(data.allType[i]);
        if (data.allType[i].local == "def") {
          isLocalIsDefIds.push(data.allType[i].id);
        }
      }
      if (data.allType[i].type == "Breakage") {
        breakageList.push(data.allType[i]);
        if (data.allType[i].local == "def") {
          isLocalIsDefIds.push(data.allType[i].id);
        }
      }
      if (data.allType[i].type == "Damagedpanel") {
        damagedPanelList.push(data.allType[i]);
        if (data.allType[i].local == "def") {
          isLocalIsDefIds.push(data.allType[i].id);
        }
      }
    }


    let coordinates = [];
    for (let i = 0; i < data.allType.length; i++) {
      coordinates.push({ lat: data.allType[i].latitude, lng: data.allType[i].longitude });
    }
    let currentIndex = 0;

    getAddr(coordinates[currentIndex]);

    function getAddr(coord) {
      let geocoder = new kakao.maps.services.Geocoder();
      let position = new kakao.maps.LatLng(coord.lat, coord.lng);
      let callback = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          if (data.allType[currentIndex].local == "def") {
            locals.push(result[0].address.region_2depth_name);
          }

          // 다음 좌표로 이동
          currentIndex++;
          if (currentIndex < coordinates.length) {
            getAddr(coordinates[currentIndex]);
          } else {
            if (locals.length != 0 && isLocalIsDefIds.length != 0) {
              localPlusFun(); // 모든 좌표에 대한 요청이 끝난 후 실행
            }
          }
        } else {
          console.error('구역없음 .Geocoder failed due to: ' + status);
          locals.push("X");
          currentIndex++;
          if (currentIndex < coordinates.length) {
            getAddr(coordinates[currentIndex]);
          }
          else {
            if (locals.length != 0 && isLocalIsDefIds.length != 0) {
              localPlusFun(); // 모든 좌표에 대한 요청이 끝난 후 실행
            }
          }
        }
      }

      geocoder.coord2Address(position.getLng(), position.getLat(), callback);
    };
    /////////////////////////////////////////////////////////////////////////////////////////road///////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////road///////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < crackList.length; i++) {
      roadMarkerList.push({
        content: 'crack',
        latlng: new kakao.maps.LatLng(crackList[i].latitude, crackList[i].longitude)
      })
    }
    for (let i = 0; i < ptholeList.length; i++) {
      roadMarkerList.push({
        content: 'pothole',
        latlng: new kakao.maps.LatLng(ptholeList[i].latitude, ptholeList[i].longitude)
      })
    }
    /////////////////////////////////////////////////////////////////////////////////////////guardRail///////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////guardRail///////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < rustList.length; i++) {
      guardRailMarkerList.push({
        content: 'rust',
        latlng: new kakao.maps.LatLng(rustList[i].latitude, rustList[i].longitude)
      })
    }
    for (let i = 0; i < breakageList.length; i++) {
      guardRailMarkerList.push({
        content: 'breakage',
        latlng: new kakao.maps.LatLng(breakageList[i].latitude, breakageList[i].longitude)
      })
    }
    /////////////////////////////////////////////////////////////////////////////////////////panel///////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////panel///////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < damagedPanelList.length; i++) {
      panelMarkerList.push({
        content: 'damaged panel',
        latlng: new kakao.maps.LatLng(damagedPanelList[i].latitude, damagedPanelList[i].longitude)
      })
    }
    creatingMap(roadMarkerList);
    //================================================================================chart======================================================================================
    //================================================================================chart======================================================================================
    //================================================================================chart======================================================================================

    let ulsanLocal = ["남구", "동구", "중구", "북구", "울주군"];
    let totalType = ["Crack", "Pothole", "Rust", "Breakage", "DamagedPanel"]
    let cntByLocals = [];
    let cntByTotalType = [];

    for (let i = 0; i < ulsanLocal.length; i++) {
      cntByLocals.push(data.allType.filter(item => item.local === ulsanLocal[i]).length);
      for (let j = 0; j < totalType.length; j++) {
        let count = data.allType.filter(item => item.local === ulsanLocal[i] && item.type === totalType[j]).length;
        cntByTotalType.push(count);

      }
    }

    // 우선도별 원형 그래프 생성
    var priorityCtx = document.getElementById('priorityPieChart');
    var priorityPieChart = new Chart(priorityCtx, {
      type: 'doughnut',
      data: {
        labels: ["Crack", "Pothole", "Rust", "Breakage", "Damaged Panel"],
        datasets: [{
          data: [crackList.length, ptholeList.length, rustList.length, breakageList.length, damagedPanelList.length], // 각 우선도별 항목 수
          backgroundColor: ['#ff645c', '#ffad29', '#f4e278', '#1bce5b', '#5a74ff'],
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



    // 지역별 위험도 도넛 차트
    var regionCtx = document.getElementById('regionPieChart');
    var regionPieChart = new Chart(regionCtx, {
      type: 'doughnut',
      data: {
        labels: ulsanLocal,
        datasets: [{
          data: cntByLocals,
          backgroundColor: [
            '#ff645c', '#ffad29', '#f4e278', '#1bce5b', '#5a74ff'
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
            padding: 10, // 범례와 차트 사이의 간격 설정 (값을 조정하여 간격 조절)
            boxWidth: 25 // 범례 색상 박스 크기 조절
          }
        }
      }
    });




    let engUlsanLocal = ["#namgu", "#donggu", "#joonggu", "#bookgu", "#uljoo"];
    let cnt = 0;
    for (let i = 0; i < engUlsanLocal.length; i++) {
      for (let j = 0; j < totalType.length; j++) {
        const elementId = engUlsanLocal[i] + totalType[j];
        const element = document.querySelector(elementId);
        if (element) {
          element.innerHTML = cntByTotalType[cnt] + "건";
          cnt++;
        }
      }
    }
  })
  //fetch 통신 실패 시 실행 영역
  .catch(err => {
    alert('fetch error!\nthen 구문에서 오류가 발생했습니다.\n콘솔창을 확인하세요!');
    console.log(err);
  });
//////////////////////////////////////////////////////////////////////////////////fetch//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////fetch//////////////////////////////////////////////////////////////////////////////////////
function localPlusFun() {
  console.log("업데이트 실행")
  fetch('/data/fetch', { //요청경로
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    //컨트롤러로 전달할 데이터
    body: new URLSearchParams({
      // 데이터명 : 데이터값
      'locals': JSON.stringify(locals),
      'ids': JSON.stringify(isLocalIsDefIds)
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
    .then((data2) => {//data -> controller에서 리턴되는 데이터!

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






// 라인 차트 생성
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
      {
        label: '도로 추세',
        data: [10, 15, 8, 12, 20, 28, 20, 6, 12, 14, 20, 15],
        borderColor: '#ff645c',
        fill: false
      },
      {
        label: '가드레일 추세',
        data: [5, 10, 5, 9, 15, 25, 18, 8, 10, 12, 18, 12],
        borderColor: '#ffad29',
        fill: false
      },
      {
        label: '교통표지판 추세',
        data: [7, 12, 9, 14, 18, 22, 17, 10, 11, 13, 17, 10],
        borderColor: '#1bce5b',
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
        padding: 15, // 범례와 차트 사이의 간격 설정 (값을 조정하여 간격 조절)
        boxWidth: 30 // 범례 색상 박스 크기 조절
      }
    }
  }
});



/////////////////////////////////////////////////////////////////////////////////////map//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////map//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////map//////////////////////////////////////////////////////////////////////////

function creatingMap(MarkerList) {
  //지도를 담을 영역의 DOM 레퍼런스
  var container = document.getElementById('map');
  //지도를 생성할 때 필요한 기본 옵션
  var options = {
    center: new kakao.maps.LatLng(35.5395907552704, 129.3115702368008), //지도의 중심좌표.
    level: 11 //지도의 레벨(확대, 축소 정도)
  };
  //지도 생성 및 객체 리턴
  var map = new kakao.maps.Map(container, options);

  var markerPositions = MarkerList;

  for (var i = 0; i < markerPositions.length; i++) {
    var marker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: positions[i].latlng // 마커의 위치
    });
    var infowindow = new kakao.maps.InfoWindow({
      content: positions[i].content // 인포윈도우에 표시할 내용
    });
    kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
    kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
  }
  // 마커가 지도 위에 표시되도록 설정합니다
}

function makeOverListener(map, marker, infowindow) {
  return function () {
    infowindow.open(map, marker);
  };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
  return function () {
    infowindow.close();
  };
}

////////////////////////////////////////////////////////////////일반 js///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////일반 js///////////////////////////////////////////////////////////////
function dataCollection() {
  alert("독일 데이터 수집중 (구현중)");
  document.querySelector("#local-option1").checked = true;
}

function removeMarker(type) {
  document.querySelector("#map").innerHTML = '';

  if (type === 'road') {
    creatingMap(roadMarkerList);
  }
  else if (type === 'guard') {
    creatingMap(guardRailMarkerList);
  }
  else if (type === 'panel') {
    creatingMap(panelMarkerList);
  }
}
