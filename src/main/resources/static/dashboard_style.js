// 지도 생성 및 초기 설정
var map = L.map('map').setView([35.5384, 129.3114], 13);

// 타일 레이어 추가
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 예시 마커 추가
L.marker([35.5384, 129.3114]).addTo(map)
  .bindPopup('가드레일 부식')
  .openPopup();


// 우선도별 원형 그래프 생성
var priorityCtx = document.getElementById('priorityPieChart').getContext('2d');
var priorityPieChart = new Chart(priorityCtx, {
  type: 'pie',
  data: {
    labels: ['crack', 'pothole', 'rust', 'breakage', 'rust_volt', 'empty'],
    datasets: [{
      data: [12, 5, 8, 7, 4, 2], // 각 우선도별 항목 수
      backgroundColor: ['#ff6384', '#ffcc00', '#36a2eb', '#4bc0c0', '#9966ff', '#ff9f40']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  }
});

// 지역별 원형 그래프 생성
var regionCtx = document.getElementById('regionPieChart').getContext('2d');
var regionPieChart = new Chart(regionCtx, {
  type: 'pie',
  data: {
    labels: ['남구', '동구', '중구', '북구', '울주'],
    datasets: [{
      data: [10, 20, 15, 25, 30], // 임의의 값
      backgroundColor: ['#ff6384', '#36a2eb', '#ffcc00', '#4bc0c0', '#9966ff']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  }
});  

// 라인 차트 생성
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [{
      label: '손상 건수 추세',
      data: [10, 15, 8, 12, 30,1,2,2,2,4,4,1],
      borderColor: 'blue',
      fill: false
    }]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
