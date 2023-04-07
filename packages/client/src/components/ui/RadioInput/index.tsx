import classNames from "classnames";
import { UseFormRegisterReturn } from "react-hook-form";

type OwnProps = {
    title: string;
    subtitle: string;
    id: string;
    register: UseFormRegisterReturn;
    className?: {
        label?: string;
        input?: string;
        wrapper?: string;
    };
    [key: string]: any;
}

export const RadioInput = ({ className, id, title, register, subtitle, ...props }: OwnProps) => {
    {/*
        <div className={classNames("flex items-center py-[5px] px-2.5 rounded-[5px] bg-primary-3", { [className?.wrapper || ""]: !!className?.wrapper })}>
        <input type="radio" {...register} className={classNames("w-5 h-5 appearance-none rounded-full border-2 border-primary-1 flex justify-center items-center before:w-2.5 before:h-2.5 before:rounded-full before:scale-0 before:duration-[120ms] before:ease-in-out before:bg-primary-1 checked:before:scale-100", { [className?.input || ""]: !!className?.input })} id={id} {...props} />
        <label htmlFor={id} className={classNames("ml-2.5 grow-[1]", { [className?.label || ""]: !!className?.label })}>
        <p className={"font-medium"}>{title}</p>
        <p className={"text-[12px] text-medium-emphasis"}>{subtitle}</p>
        </label>
        </div>
        */}
    return (
        <input type="radio" {...register} className={classNames("w-5 h-5 appearance-none rounded-full border-2 border-primary-1 flex justify-center items-center before:w-2.5 before:h-2.5 before:rounded-full before:scale-0 before:duration-[120ms] before:ease-in-out before:bg-primary-1 checked:before:scale-100", { [className?.input || ""]: !!className?.input })} id={id} {...props} />
    )
}
