import { Status } from '@app/shared/types/Happening.type';
import classNames from 'classnames';
import { CalendarIcon } from '@/components/ui/Icons/Calendar';

type OwnProps = {
    startAt: string;
    status: Status;
};

export function StartTime({ startAt, status }: OwnProps) {
    const startDateWithWeekday = new Date(startAt).toLocaleDateString([], {
        month: 'short',
        weekday: 'short',
        day: 'numeric',
    }); // for example Fri, Sep 21

    const startTime = new Date(startAt).toLocaleTimeString([], {
        timeStyle: 'short',
        hour12: false,
    }); // for example 5:24 pm

    return (
        <div className="flex items-center">
            {status != Status.InQueue && (
                <CalendarIcon
                    color={
                        status === Status.NotStarted
                            ? 'var(--app-primary-1)'
                            : status === Status.Happening
                            ? 'var(--app-success)'
                            : status === Status.Finished
                            ? 'var(--app-error)'
                            : ''
                    }
                />
            )}
            <span
                className={classNames(
                    'text-[12px] ml-2.5 font-semibold text-medium-emphasis',
                    { 'text-success': status === Status.Happening },
                )}
            >
                {status === Status.NotStarted &&
                    `${startDateWithWeekday}th ∙ ${startTime}`}
                {status === Status.Happening && `Happening Now`}
                {status === Status.Finished && `Finished`}
                {status === Status.InQueue && `In Queue To Be Started`}
            </span>
        </div>
    );
}
