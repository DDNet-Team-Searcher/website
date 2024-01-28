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
    });

    const startTime = new Date(startAt).toLocaleTimeString([], {
        timeStyle: 'short',
        hour12: false,
    });

    return (
        <span
            className={classNames(
                'uppercase text-primary-1 text-xs font-medium',
                { 'text-success': status === Status.Happening },
            )}
        >
            {status === Status.NotStarted &&
                `${startDateWithWeekday}th ${startTime}`}
            {status === Status.Happening && `Happening Now`}
            {status === Status.Finished && `Finished`}
            {status === Status.InQueue && `In Queue To Be Started`}
        </span>
    );
}
