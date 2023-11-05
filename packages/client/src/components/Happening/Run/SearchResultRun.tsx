import { StartTime } from '../StartTime';
import { Place } from '../Place';
import { Avatar } from '@/components/Avatar';
import { ActionButtons } from './ActionButtons';
import Link from 'next/link';
import { Title } from './Title';
import { InterestedButton } from './InterestedButton';
import { RunProps } from './types';
import { Happenings } from '@app/shared/types/Happening.type';

export function SearchResultRun({
    run,
    setIsInterestedDispatch,
    deleteDispatch,
    setStatusDispatch,
}: RunProps) {
    const {
        id,
        mapName,
        place,
        startAt,
        status,
        description,
        isInterested,
        author: { id: authorId, username },
        _count: { interestedPlayers },
    } = run;

    return (
        <div className="flex bg-primary-2 rounded-[10px]">
            <img
                src={`https://ddnet.org/ranks/maps/${mapName.replaceAll(
                    ' ',
                    '_',
                )}.png`}
                className="max-w-[256px] w-full object-cover rounded-l-[10px]"
                alt="map thumbnail"
            />
            <div className="grow px-5 py-4">
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
                <div className="flex items-center justify-between mt-4">
                    <Link href={`/profile/${authorId}`}>
                        <Avatar src={null} username={username} />
                    </Link>
                    <div className="flex">
                        <ActionButtons
                            type={Happenings.Run}
                            runId={id}
                            authorId={authorId}
                            status={status}
                            setStatusDispatch={setStatusDispatch}
                            deleteDispatch={deleteDispatch}
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
