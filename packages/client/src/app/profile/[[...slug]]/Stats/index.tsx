import { useEffect, useState } from 'react';
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
    ChartData,
    ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { getUserStats } from '@/store/slices/user';

type OwnProps = {
    username: string;
};

export function Stats({ username }: OwnProps) {
    const [fetchedData, setFecthedData] = useState<
        null | [string, number, number][]
    >();
    const dispatch = useAppDispatch();

    useEffect(() => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Filler,
            Legend,
        );
    }, []);

    useEffect(() => {
        dispatch(getUserStats(username)).then((res) => {
            setFecthedData(res);
        });
    }, [username]);

    const options: ChartOptions<'line'> = {
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
    };

    const data: ChartData<'line'> = {
        labels: fetchedData?.map((row) => row[0]),
        datasets: [
            {
                fill: true,
                label: `${username}'s points`,
                data: fetchedData?.map((row) => row[2])!,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <section>
            {fetchedData && <Line options={options} data={data} />}
        </section>
    );
}
