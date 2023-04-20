import { Event, Run } from './Happenings.type';

export type HappeningWithConnectString<T = Event | Run> = Omit<T, 'server'> & {
    server: {
        connectString: string;
    };
};
