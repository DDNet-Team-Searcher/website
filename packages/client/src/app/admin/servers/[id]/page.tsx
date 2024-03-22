'use client';

import { useGetServerQuery } from '@/features/api/servers.api';
import { socket } from '@/socket';
import { ServerInfo } from '@app/shared/types/Server.type';
import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    ChartOptions,
    ChartData,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

type OwnProps = {
    params: {
        id: string;
    };
};

const MAX_ELEMENTS = 20;
const UPDATE_INTERVAL = 2_000;

export default function ServerPage({ params: { id } }: OwnProps) {
    const { data: server } = useGetServerQuery(parseInt(id));
    const [system, setSystem] = useState<ServerInfo['system'][]>([]);
    const [happenings, setHappenings] = useState<ServerInfo['happenings']>([]);

    useEffect(() => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Filler,
        );

        const interval = setInterval(() => {
            socket.emit('stats', id);
        }, UPDATE_INTERVAL);

        socket.on('stats', (data: ServerInfo) => {
            setSystem((prev) => {
                if (prev.length >= MAX_ELEMENTS) {
                    prev.shift();
                    return [...prev, data.system];
                }

                return [...prev, data.system];
            });
            setHappenings(data.happenings);
        });

        return () => clearInterval(interval);
    }, []);

    const data: ChartData<'line'> = {
        labels: new Array(MAX_ELEMENTS).fill(''),
        datasets: [
            {
                label: 'Server load',
                backgroundColor: 'grey',
                borderColor: 'grey',
                borderWidth: 0,
                pointRadius: 0,
                data: system.map((srv) => srv.load),
                fill: true,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        animation: {
            duration: 0,
        },
        plugins: {
            title: {
                display: true,
                text: 'Server Load Over Time',
            },
        },
        interaction: {
            intersect: false,
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <>
            {server && server.status === 'success' && (
                <>
                    <div>
                        <Line options={options} data={data} />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {happenings.map((happening, id) => (
                            <div
                                key={id}
                                className="bg-primary-2 hover:bg-primary-3 transition-all duration-200 text-medium-emphasis p-4 rounded-xl basis-36 grow"
                            >
                                <p>Port: {happening.port}</p>
                                <p>Pid: {happening.pid}</p>
                                <p>Map name: {happening.mapName}</p>
                                <p>Password: {happening.password}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
