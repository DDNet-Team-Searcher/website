import { Event, Run } from 'src/types/Happenings.type';
import { HappeningWithConnectString } from 'src/types/HappeningWithConnectString.type';

export const computeConnectString = <T extends Run | Event>(data: T): HappeningWithConnectString<T> => {
    const { ip, port, password } = data.server;

    return {
        ...data,
        server: {
            connectString: `password "${password}"; connect ${ip}:${port}`,
        },
    };
};
