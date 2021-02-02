import React from 'react';
import {Line} from 'react-chartjs-2'


export default function EventsHourly(props) {

    let clicks = props.hourly.map(item=> item["clicks"])
    let impressions = props.hourly.map(item=> item["impressions"]/1000)
    let revenue = props.hourly.map(item=> item["revenue"])
    let date= props.hourly.map(item=> `${item["date"].slice(5, 10)} hr${item["hour"]}`)


    return (
        <div>
            <Line
                data={{
                    labels: date,
                    datasets: [{
                        label: 'Clicks',
                        data: clicks,
                        fill:false,
                        borderColor: [
                            'rgba(255, 99, 132, 0.2)',
                        ]
                    },
                        {
                            label: 'Impressions(in 1000)',
                            data: impressions,
                            fill:false,
                            borderColor: [
                                'rgba(54, 162, 235, 0.2)',
                            ]
                        },
                        {
                            label: 'Revenue',
                            data: revenue,
                            fill:false,
                            borderColor: [
                                'rgba(255, 206, 86, 0.2)',
                            ]
                        }
                    ]
                }}
                width={100}
                height={400}
                options={{
                    maintainAspectRatio: false,
                    scales:{
                        yAxes:[
                            {
                                ticks:{
                                    beginAtZero:true
                                }
                            }

                        ]
                    }
                }}
            />

        </div>
    )

};

