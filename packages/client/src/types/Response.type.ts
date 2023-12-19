type Success<T extends object | null> = {
    status: 'success';
    data: T;
    message?: string;
};

export type Fail<T extends object | null> = {
    status: 'fail';
    data: T extends object
        ? {
              [key in keyof T]?: string;
          }
        : null;
    message?: string;
};

export type ResError = {
    status: 'error';
    message: string;
};

export type GetSuccess<T> = T extends Success<infer U> ? Success<U> : never;

export type GetFail<T> = T extends Fail<infer U> ? Fail<U> : never;

export type Response<
    S extends object | null = null,
    F extends object | null = null,
> = Success<S> | Fail<F> | ResError;

export type ExcludeSuccess<T> = Exclude<T, GetSuccess<T>>;
