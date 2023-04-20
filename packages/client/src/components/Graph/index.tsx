import { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useAppDispatch } from '@/utils/hooks/hooks'
import { getUserStats } from '@/store/slices/user'
// import { getUserStats } from '@/store/slices/app'

type OwnProps = {
    username: string;
}

export const Graph = ({ username }: OwnProps) => {
    const [fetchedData, setFecthedData] = useState()
    const dispatch = useAppDispatch()

    useEffect(() => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Filler,
            Legend
        )
    }, [])

    useEffect(() => {
        dispatch(getUserStats(username)).then(res => {
            setFecthedData(res)
        })
    }, [username])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Points per year',
            },
        },
    }

    //FIXME: Do types here =]

    const data = {
        //@ts-ignore
        labels: fetchedData?.rows?.map(row => row[0]),
        datasets: [
            {
                fill: true,
                label: `${username}'s points`,
                //@ts-ignore
                data: fetchedData?.rows?.map(row => row[2]),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }

    return (
        <>
            {fetchedData &&
                <Line options={options} data={data} />
            }
        </>
    )
}
