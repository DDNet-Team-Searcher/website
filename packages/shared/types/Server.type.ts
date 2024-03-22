export type Server = {
    id: number;
    ip: string;
    online: boolean;
};

export type ServerInfo = {
    system: {
        totalMemory: number;
        freeMemory: number;
        load: number;
    };
    happenings: {
        pid: number;
        mapName: string;
        port: number;
        password: string;
    }[];
};
