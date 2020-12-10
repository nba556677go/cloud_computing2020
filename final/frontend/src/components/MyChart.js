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

//export default  MyChart