import React from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ScriptableContext
} from 'chart.js'

interface GraphComponentProps {
    data: number[],
    labels: string[],
    topColor: string,
    bottomColor: string,
    borderColor: string,
    graphHeight?: number
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const GraphComponent: React.FC<GraphComponentProps> = (props) => {
    const data = {
        labels: props.labels,
        datasets: [
            {
                fill: true,
                backgroundColor: (context: ScriptableContext<"line">) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 310);
                    gradient.addColorStop(0, props.topColor);
                    gradient.addColorStop(1, props.bottomColor);
                    return gradient;
                },
                data: props.data,
                borderColor: props.borderColor,
                tension: 0.3,
                pointBorderColor: props.borderColor,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: props.borderColor,
                pointHoverBorderColor: props.borderColor,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                label: '',
                tooltipTemplate: "",
                pointHitRadius: 70,
            }
        ],
    }

    const options = {
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            }
        },
        plugins: {
            legend: {
                display: false,
            }
        },
        maintainAspectRatio: false
    }
    return (
        <div
            style={{
                height: `${props.graphHeight ? `${props.graphHeight}px` : `100px`}`,
            }}>
            <Line
                height={'100px'}
                width={'100%'}
                data={data}
                options={options}
            />
        </div>
    )
}

export default GraphComponent