import { Status } from '@app/shared/types/Happening.type';
import classNames from 'classnames';
import { useTranslation } from '@/i18/client';

type OwnProps = {
    startAt: string;
    status: Status;
};

export function StartTime({ startAt, status }: OwnProps) {
    const { i18n } = useTranslation('happening');

    const datetime = i18n.format(
        new Date(startAt),
        'intlDateTime',
        i18n.language,
    );

    return (
        <span
            className={classNames(
                'uppercase text-primary-1 text-xs font-medium',
                { 'text-success': status === Status.Happening },
            )}
        >
            {status === Status.NotStarted && datetime}
            {status === Status.Happening && `Happening Now`}
            {status === Status.Finished && `Finished`}
            {status === Status.InQueue && `In Queue To Be Started`}
        </span>
    );
}
