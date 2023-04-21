export type Response<T extends any[]> = {
    ok: boolean;
    database: string;
    query_name: null | string;
    rows: T;
    truncated: boolean;
    columns: string[];
    query: {
        sql: string;
        params: {
            [key: string]: string;
        };
    };
    error: null | string;
    private: boolean;
    allow_execute_sql: boolean;
    query_ms: number;
};
