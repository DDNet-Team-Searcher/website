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
import { CreateAndUpdateHappeningModal, ModalMode } from '@/components/CreateAndUpdateHappeningModal';
import { useState } from 'react';
import { getMapUrl } from '@/utils/getMapUrl';

export function Run({
    className,
    run,
    setStatusDispatch,
    deleteDispatch,
    setIsInterestedDispatch,
}: RunProps) {
    const [isEditRunModalVisible, setIsEditRunModalVisible] = useState(false);

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

    const runData = {
        place,
        mapName,
        teamSize: teamSize.toString(),
        startDate: new Date(startAt).toISOString().substring(0, 10),
        startTime: new Date(startAt).toISOString().substring(11, 16),
        description: description || '',

        // event's fields
        endDate: '',
        endTime: '',
        title: '',
        thumbnail: null,
    };

    const editRun = () => {
        setIsEditRunModalVisible(true);
    }

    const onClose = () => {
        setIsEditRunModalVisible(false);
    }

    //FIXME: now it created a new modal for every run ._.
    //FIXME: had to remove `hover:scale-[1.01]` from first div coz it was cursed as fuck
    return (
        <div
            className={classNames(
                'max-w-[255px] w-full bg-primary-2 rounded-[10px] flex flex-col transition-all duration-150',
                { [className || '']: className },
            )}
        >
            <CreateAndUpdateHappeningModal
                onClose={onClose}
                type='run'
                data={runData}
                happeningId={id}
                mode={ModalMode.Edit}
                isVisible={isEditRunModalVisible}
            />
            <img
                src={getMapUrl(mapName)}
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
                            editRun={editRun}
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
