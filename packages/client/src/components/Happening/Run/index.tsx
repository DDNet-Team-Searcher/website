import classNames from 'classnames';
import Link from 'next/link';
import { StartTime } from '../StartTime';
import { Place } from '../Place';
import { Avatar } from '@/components/Avatar';
import { ActionButtons } from './ActionButtons';
import { Title } from './Title';
import { InterestedButton } from './InterestedButton';
import { RunProps } from './types';
import { Happenings } from '@app/shared/types/Happening.type';

export function Run({
    className,
    run,
    setStatusDispatch,
    deleteDispatch,
    setIsInterestedDispatch,
}: RunProps) {
    const {
        description,
        id,
        mapName,
        place,
        startAt,
        status,
        teamSize,
        isInterested,
        author: { avatar, username, id: authorId },
        _count: { interestedPlayers },
    } = run;

    return (
        <div
            className={classNames(
                'max-w-[255px] w-full bg-primary-2 rounded-[10px] flex flex-col hover:scale-[1.01] transition-all duration-150',
                { [className || '']: className },
            )}
        >
            <img
                src={`https://ddnet.org/ranks/maps/${mapName.replaceAll(
                    ' ',
                    '_',
                )}.png`}
                className="w-full max-h-[100px] object-cover rounded-t-[10px]"
                alt="map thumbnail"
            />
            <div className="p-2.5 flex flex-col grow-[1]">
                <div className="flex justify-between">
                    <StartTime startAt={startAt} status={status} />
                    <div
                        className={
                            'bg-primary-3 text-high-emphasis py-[3px] px-[7px] rounded-full flex items-center'
                        }
                    >
                        <img src="/run-people.svg" />
                        <span className="text-[12px] ml-1">
                            {interestedPlayers}
                        </span>
                    </div>
                </div>
                <Place place={place} />
                <Title title={mapName} run={run} />
                <p className="mt-1 text-medium-emphasis break-words">
                    {description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                    <Link href={`/profile/${authorId}`}>
                        <Avatar src={avatar} username={username} />
                    </Link>
                    <div className="flex">
                        <ActionButtons
                            type={Happenings.Run}
                            runId={id}
                            status={status}
                            authorId={authorId}
                            deleteDispatch={deleteDispatch}
                            setStatusDispatch={setStatusDispatch}
                        />
                        <InterestedButton
                            isUserInterestedInRun={isInterested}
                            runId={id}
                            setIsInterestedDispatch={setIsInterestedDispatch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
