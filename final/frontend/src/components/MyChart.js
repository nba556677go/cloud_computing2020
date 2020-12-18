import React from 'react'
//import { Chart } from 'react-charts'
import Chart from 'react-apexcharts'


export default function MyChart(info) {
    //let x = []
    let y = []
    for(let i = 0 ; i < info.info.availBike.length ; i++){
        //x.push(info.info.availBike[i].time)
        y.push(info.info.availBike[i].availBike)
    }

    let series = [{
        name: "Available Bikes",
        data: y
    }]
    
    let options = {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 8
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: `Available Bikes at ${info.info.chineseID}`,
        align: 'left', 
        style: {
          fontSize:  '28px',
          fontWeight:  'bold',
          fontFamily:  undefined,
          color:  '#263238'
        }
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: info.info.time,
      }
    }
      
      
      
    

    return (
      <div id="chart">
            <Chart options={options} series={series} type="line" height={350} />
        </div>
    )
}


export function MyDistrictChart(data) {
  console.log(data)

  //console.log(district)
  let series = [{
      name: "Available bikes",
      data: data.data.data.availBike
  }]
  
  let options = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: true
      }
    },
    
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
  
      }
    },
    colors: [
      "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
      "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
      "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
    ],
    dataLabels: {
      enabled: true,
      position: 'top',
      dropShadow: {
        enabled: true,
        left: 2,
        top: 2,
        opacity: 0.5
      },
      style: {
        fontSize: '14spx'
      }

    },

    legend: {
      show: false
    },
    labels: {
      style: {
        fontSize: '15px'
      }
    },
    title: {
      text: `Live Top 10 Bike Sites at ${data.data.district}!!`,
      align: 'left', 
      style: {
        fontSize:  '28px',
        fontWeight:  'bold',
        fontFamily:  undefined,
        color:  '#263238'
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: data.data.data.stationID
    }
  }
    
    
    
  

  return (
    <div id="chart">
          <Chart options={options} series={series} type="bar" height={350} />
      </div>
  )
}
//export default  MyChart