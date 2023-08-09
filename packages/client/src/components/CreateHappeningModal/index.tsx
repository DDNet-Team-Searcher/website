import {
    useCreateEventMutation,
    useCreateRunMutation,
} from '@/features/api/happenings.api';
import { addHappening } from '@/store/slices/happenings';
import { hint } from '@/store/slices/hints';
import { CreateEventResponse, CreateRunResponse } from '@/types/api.type';
import { Happenings } from '@/types/Happenings.type';
import { ExcludeSuccess } from '@/types/Response.type';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { InputWithLabel } from '../ui/InputWithLabel';
import { Modal } from '../ui/Modal';
import { RadioInput } from '../ui/RadioInput';
import { TextareaWithLabel } from '../ui/TextareaWithLabel';

type OwnProps = {
    isVisible: boolean;
    onClose: () => void;
    type: 'run' | 'event';
};

export function CreateHappeningModal({ type, isVisible, onClose }: OwnProps) {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [createRun] = useCreateRunMutation();
    const [createEvent] = useCreateEventMutation();
    const dispatch = useAppDispatch();
    const ref = useRef<null | HTMLInputElement>(null);
    const [isEndFieldsVisible, setIsEndFieldsVisible] = useState(false);
    const defaultValues = {
        place: '',
        mapName: '',
        teamSize: '',
        startDate: '',
        startTime: '',
        description: '',

        // event's fields
        endDate: '',
        endTime: '',
        title: '',
        thumbnail: null as null | File,
    };
    const {
        setError,
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues,
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEndFieldsVisible(e.target.checked);
    };

    const onSubmit = async (values: typeof defaultValues) => {
        console.log(type);
        if (type === 'event') {
            try {
                const endAt = values.endDate + ' ' + values.endTime;
                type EventDataT = {
                    place: number;
                    title: string;
                    mapName: string;
                    startAt: string;
                    thumbnail: null | File;
                    description: string | null;
                    endAt?: string;
                };

                const eventData: EventDataT = {
                    place: values.place === 'HERE' ? 0 : 1,
                    title: values.title,
                    mapName: values.mapName,
                    description: values.description ?? null,
                    startAt: values.startDate + ' ' + values.startTime,
                    thumbnail: values.thumbnail,
                };

                if (endAt.trim() !== '') {
                    eventData.endAt = endAt;
                }

                const res = await createEvent(eventData).unwrap();

                if (res.status === 'success') {
                    onClose();
                    dispatch(
                        addHappening({
                            type: Happenings.Event,
                            happening: res.data.event,
                        }),
                    );
                }
            } catch (err) {
                const error = (err as FetchBaseQueryError)
                    .data as ExcludeSuccess<CreateEventResponse>;

                if (error.status === 'fail') {
                    for (let [key, value] of Object.entries(error.data ?? {})) {
                        setError(key as keyof typeof error.data, {
                            message: value,
                        });
                    }

                    if ('message' in error && error.message !== undefined) {
                        dispatch(hint({ type: 'error', text: error.message }));
                    }
                } else if (error.status === 'error') {
                    dispatch(hint({ type: 'error', text: error.message }));
                }
            }
        } else if (type === 'run') {
            try {
                const res = await createRun({
                    place: values.place === 'HERE' ? 0 : 1,
                    description: values.description ?? null,
                    teamSize: parseInt(values.teamSize),
                    mapName: values.mapName,
                    startAt: values.startDate + ' ' + values.startTime,
                }).unwrap();

                if (res.status === 'success') {
                    onClose();
                    dispatch(
                        addHappening({
                            type: Happenings.Run,
                            happening: res.data.run,
                        }),
                    );
                }
            } catch (err) {
                const error = (err as FetchBaseQueryError)
                    .data as ExcludeSuccess<CreateRunResponse>;

                if (error.status === 'fail') {
                    for (let [key, value] of Object.entries(error.data ?? {})) {
                        setError(key as keyof typeof error.data, {
                            message: value,
                        });
                    }

                    if ('message' in error && error.message !== undefined) {
                        dispatch(hint({ type: 'error', text: error.message }));
                    }
                } else if (error.status === 'error') {
                    dispatch(hint({ type: 'error', text: error.message }));
                }
            }
        }
    };

    const inputs = [
        {
            title: 'Somewhere else.',
            subtitle: 'You can get team and go play on official DDnet servers.',
            value: 'THERE',
        },
        {
            title: 'Our own shitty servers.',
            subtitle: 'You will have less change to get ddosed.',
            value: 'HERE',
        },
    ];

    return (
        <Modal
            className={'create-run'}
            visible={isVisible}
            onClose={onClose}
            width={'600px'}
        >
            <p className="text-3xl m-0 pt-6 px-5">Create your own {type}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-6">
                    <div>
                        <p
                            className="text-xl mt-5"
                            style={{ margin: '40px 0 0' }}
                        >
                            Where's your {type}?
                        </p>
                        <p className={'text-sm mt-1 text-high-emphasis'}>
                            So noone gets lost on where to go?
                        </p>

                        {inputs.map((val, id) => (
                            <div
                                className="flex items-center py-[5px] px-2.5 rounded-[5px] bg-primary-3 mt-5"
                                key={id}
                            >
                                <RadioInput
                                    title={'Our own servers.'}
                                    value={val.value}
                                    subtitle={
                                        'You will have less change to get ddosed.'
                                    }
                                    id={val.value}
                                    register={register('place')}
                                    className={{ wrapper: 'mt-5' }}
                                />
                                <label
                                    htmlFor={val.value}
                                    className={classNames('ml-2.5 grow-[1]')}
                                >
                                    <p className={'font-medium'}>{val.title}</p>
                                    <p
                                        className={
                                            'text-[12px] text-medium-emphasis'
                                        }
                                    >
                                        {val.subtitle}
                                    </p>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className={'text-xl mt-5'}>
                            Tell us more about your {type}
                        </p>
                        <p className={'text-sm mt-1 text-high-emphasis'}>
                            Fill fields down below!
                        </p>
                        <div className="flex justify-between mt-4">
                            {type === 'event' ? (
                                <InputWithLabel
                                    className={{ container: 'max-w-[256px]' }}
                                    register={register('title')}
                                    label="event title"
                                    placeholder="How would you name event?"
                                    required
                                />
                            ) : (
                                <InputWithLabel
                                    className={{ container: 'max-w-[256px]' }}
                                    register={register('mapName')}
                                    label="map name"
                                    placeholder="Map you're gonna play?"
                                    required
                                />
                            )}
                            {type === 'event' ? (
                                <InputWithLabel
                                    className={{ container: 'max-w-[256px]' }}
                                    register={register('mapName')}
                                    label="map name"
                                    placeholder="Map you're gonna play?"
                                    required
                                />
                            ) : (
                                <InputWithLabel
                                    className={{ container: 'max-w-[256px]' }}
                                    register={register('teamSize')}
                                    label="team size"
                                    placeholder="What team size do you want?"
                                    required
                                    type="number"
                                    min={2}
                                    max={64}
                                />
                            )}
                        </div>
                        <div className="flex justify-between mt-4 w-full">
                            <InputWithLabel
                                className={{ container: 'max-w-[256px]' }}
                                register={register('startDate')}
                                label="start date"
                                required
                                type="date"
                            />
                            <InputWithLabel
                                className={{ container: 'max-w-[256px]' }}
                                register={register('startTime')}
                                label="start time"
                                required
                                type="time"
                                pattern="[0-9]{2}:[0-9]{2}"
                            />
                        </div>
                    </div>
                    {type == 'event' && (
                        <div className="mt-5 flex content-center">
                            <input
                                onChange={onChange}
                                className="appearance-none w-4 h-4 bg-[rgba(0,0,0,.45)] bordered-[2px] checked:bg-[url('/check-mark.png')] bg-no-repeat bg-center"
                                id="show-end-fields"
                                type="checkbox"
                            />
                            <label
                                htmlFor="show-end-fields"
                                className="text-[12px] uppercase ml-2.5"
                            >
                                Add end date & time
                            </label>
                        </div>
                    )}
                    {type == 'event' && isEndFieldsVisible && (
                        <div className="flex justify-between mt-4">
                            <InputWithLabel
                                className={{ container: 'max-w-[256px]' }}
                                register={register('endDate')}
                                label="end date"
                                required
                                type="date"
                            />
                            <InputWithLabel
                                className={{ container: 'max-w-[256px]' }}
                                register={register('endTime')}
                                label="end time"
                                required
                                type="time"
                                pattern="[0-9]{2}:[0-9]{2}"
                            />
                        </div>
                    )}
                    <TextareaWithLabel
                        className={{ container: 'mt-5' }}
                        register={register('description')}
                        label="Description"
                        placeholder="Here you can describe a teammate of dream, are weebs people or whatever you want"
                    />
                    {type == 'event' && (
                        <div>
                            <div>
                                <label
                                    htmlFor="coverImage"
                                    className="uppercase mt-[15px] text-[12px]"
                                >
                                    Cover image
                                </label>
                                <input
                                    {...register('thumbnail', {
                                        onChange: (e) => {
                                            if (e?.target?.files?.length) {
                                                setValue(
                                                    'thumbnail',
                                                    e.target.files[0],
                                                );
                                            }
                                        },
                                    })}
                                    ref={ref}
                                    type="file"
                                    className="hidden"
                                />
                                <Button
                                    className="mt-2.5"
                                    onClick={() => ref?.current?.click()}
                                    type="button"
                                    styleType="filled"
                                >
                                    Upload cover image
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-between mt-6 px-5 py-6 bg-[#1A1714] rounded-b-[10px]">
                    <Button styleType={'bordered'} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        styleType={'filled'}
                        type={'submit'} /*disabled={isSubmitButtonDisabled}*/
                    >
                        Create {type}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
