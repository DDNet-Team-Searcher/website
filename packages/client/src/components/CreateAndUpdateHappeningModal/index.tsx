import {
    useCreateEventMutation,
    useCreateRunMutation,
    useUpdateHappeningMutation,
} from '@/features/api/happenings.api';
import {
    CreateEventResponse,
    CreateRunResponse,
    UpdateHappeningResponse,
} from '@app/shared/types/api.type';
import { ExcludeSuccess } from '@app/shared/types/Response.type';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { InputWithLabel } from '../ui/InputWithLabel';
import { Modal } from '../ui/Modal';
import { RadioInput } from '../ui/RadioInput';
import { TextareaWithLabel } from '../ui/TextareaWithLabel';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';
import { Carousel, CarouselRef } from '../ui/Carousel';
import { Happenings } from '@app/shared/types/Happening.type';
import { useTranslation } from '@/i18/client';

export enum ModalMode {
    Create,
    Edit,
}

export type FormFields = {
    place: string;
    mapName: string;
    teamSize: string;
    startDate: string;
    startTime: string;
    description: string;

    // event's fields
    endDate: string;
    endTime: string;
    title: string;
    thumbnail: null | File;
};

type OwnProps = {
    isVisible: boolean;
    onClose: (cb: () => void) => void;
    type: Happenings;
    mode: ModalMode;
    data?: FormFields;
    happeningId?: number;
};

//NOTE: I literally spent few fukcing hours thinking about how to name this
//component but i couldnt come up with something good :pepeW:
export function CreateAndUpdateHappeningModal({
    type,
    isVisible,
    onClose,
    mode,
    data,
    happeningId,
}: OwnProps) {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [createRun] = useCreateRunMutation();
    const [createEvent] = useCreateEventMutation();
    const [updateHappening] = useUpdateHappeningMutation();
    const ref = useRef<HTMLInputElement>(null);
    const [isEndFieldsVisible, setIsEndFieldsVisible] = useState(false);
    const handleFormError = useHandleFormError();
    const carouselRef = useRef<CarouselRef>(null);
    const [cur, setCur] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { t } = useTranslation('common');
    let defaultValues: FormFields = {
        place: '',
        mapName: '',
        teamSize: '',
        startDate: new Date().toISOString().substring(0, 10),
        startTime: new Date().toISOString().substring(11, 16),
        description: '',

        // event's fields
        endDate: '',
        endTime: '',
        title: '',
        thumbnail: null,
    };

    useEffect(() => {
        if (mode == ModalMode.Edit && data) {
            for (const [key, value] of Object.entries(data)) {
                //this is fine...
                setValue(key as any, value);
            }
        }
    }, [mode, data]);

    const inputs = [
        {
            title: t('happening_form.fields.place.options.internal.title'),
            subtitle: t(
                'happening_form.fields.place.options.internal.subtitle',
            ),
            value: 'HERE',
        },
        {
            title: t('happening_form.fields.place.options.external.title'),
            subtitle: t(
                'happening_form.fields.place.options.external.subtitle',
            ),
            value: 'THERE',
        },
    ];

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
        clearErrors,
        watch,
        setError,
    } = useForm({
        defaultValues,
    });
    const watchThumbnail = watch('thumbnail');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEndFieldsVisible(e.target.checked);
    };

    const onSubmit = async (values: FormFields) => {
        if (mode === ModalMode.Create) {
            if (type === Happenings.Event) {
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
                        onClose(clearErrors);
                    }
                } catch (err) {
                    const error = (err as FetchBaseQueryError)
                        .data as ExcludeSuccess<CreateEventResponse>;

                    handleFormError(error, setError);
                }
            } else if (type === Happenings.Run) {
                try {
                    const res = await createRun({
                        place: values.place === 'HERE' ? 0 : 1,
                        description: values.description ?? null,
                        teamSize: parseInt(values.teamSize),
                        mapName: values.mapName,
                        startAt: values.startDate + ' ' + values.startTime,
                    }).unwrap();

                    if (res.status === 'success') {
                        onClose(clearErrors);
                    }
                } catch (err) {
                    const error = (err as FetchBaseQueryError)
                        .data as ExcludeSuccess<CreateRunResponse>;

                    handleFormError(error, setError);
                }
            }
        } else if (mode === ModalMode.Edit) {
            if (type === Happenings.Event) {
                const endAt = values.endDate + ' ' + values.endTime;

                type EventDataT = {
                    place: number;
                    title: string;
                    mapName: string;
                    startAt: string;
                    thumbnail: File | null | undefined;
                    description: string | null | undefined;
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

                try {
                    const res = await updateHappening({
                        id: happeningId!,
                        data: eventData,
                    }).unwrap();

                    if (res.status === 'success') {
                        onClose(clearErrors);
                    }
                } catch (err) {
                    const error = (err as FetchBaseQueryError)
                        .data as ExcludeSuccess<UpdateHappeningResponse>;

                    handleFormError(error, setError);
                }
            } else if (type === Happenings.Run) {
                const runData = {
                    place: values.place === 'HERE' ? 0 : 1,
                    description: values.description ?? null,
                    teamSize: parseInt(values.teamSize),
                    mapName: values.mapName,
                    startAt: values.startDate + ' ' + values.startTime,
                };

                try {
                    const res = await updateHappening({
                        id: happeningId!,
                        data: runData,
                    }).unwrap();

                    if (res.status === 'success') {
                        onClose(clearErrors);
                    }
                } catch (err) {
                    const error = (err as FetchBaseQueryError)
                        .data as ExcludeSuccess<UpdateHappeningResponse>;

                    handleFormError(error, setError);
                }
            }
        }
    };

    useEffect(() => {
        if (watchThumbnail) {
            setPreviewUrl(URL.createObjectURL(watchThumbnail));
        }
    }, [watchThumbnail]);

    const next = () => {
        carouselRef.current?.next();
        setCur((cur) => cur + 1);
    };

    const prev = () => {
        carouselRef.current?.prev();
        setCur((cur) => cur - 1);
    };

    const removeThumbnail = () => {
        setValue('thumbnail', null);
        setPreviewUrl(null);
    };

    let title: string = '';

    if (mode == ModalMode.Create) {
        if (type === Happenings.Run) {
            title = t('happening_form.create_run');
        } else if (type === Happenings.Event) {
            title = t('happening_form.create_event');
        }
    } else if (mode == ModalMode.Edit) {
        if (type === Happenings.Run) {
            title = t('happening_form.update_run');
        } else if (type === Happenings.Event) {
            title = t('happening_form.update_event');
        }
    }

    return (
        <Modal
            visible={isVisible}
            onClose={() => onClose(clearErrors)}
            width={'600px'}
        >
            <p className="text-3xl m-0 pt-6 px-5">{title}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-6 pb-6 !max-h-[75vh] overflow-y-auto">
                    <Carousel ref={carouselRef} controls={false}>
                        <div>
                            <p
                                className="text-xl mt-5"
                                style={{ margin: '40px 0 0' }}
                            >
                                {t('happening_form.step1_title')}
                            </p>
                            <p className={'text-sm mt-1 text-high-emphasis'}>
                                {t('happening_form.step1_subtitle')}
                            </p>

                            {inputs.map((val, id) => (
                                <div
                                    className="flex items-center py-[5px] px-2.5 rounded-[5px] bg-primary-3 mt-5"
                                    key={id}
                                >
                                    <RadioInput
                                        value={val.value}
                                        id={val.value}
                                        register={register('place')}
                                    />
                                    <label
                                        htmlFor={val.value}
                                        className={classNames(
                                            'ml-2.5 grow-[1]',
                                        )}
                                    >
                                        <p className={'font-medium'}>
                                            {val.title}
                                        </p>
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
                            <div>
                                <p className={'text-xl mt-5'}>
                                    {t('happening_form.step2_title')}
                                </p>
                                <p
                                    className={
                                        'text-sm mt-1 text-high-emphasis'
                                    }
                                >
                                    {t('happening_form.step2_subtitle')}
                                </p>
                                <div className="flex justify-between mt-4">
                                    {type === Happenings.Event ? (
                                        <InputWithLabel
                                            errors={errors}
                                            className={{
                                                container: 'max-w-[256px]',
                                            }}
                                            register={register('title')}
                                            label={t(
                                                'happening_form.fields.title.title',
                                            )}
                                            placeholder={t(
                                                'happening_form.fields.title.placeholder',
                                            )}
                                            required
                                        />
                                    ) : (
                                        <InputWithLabel
                                            errors={errors}
                                            className={{
                                                container: 'max-w-[256px]',
                                            }}
                                            register={register('mapName')}
                                            label={t(
                                                'happening_form.fields.map.title',
                                            )}
                                            placeholder={t(
                                                'happening_form.fields.map.placeholder',
                                            )}
                                            required
                                        />
                                    )}
                                    {type === Happenings.Event ? (
                                        <InputWithLabel
                                            errors={errors}
                                            className={{
                                                container: 'max-w-[256px]',
                                            }}
                                            register={register('mapName')}
                                            label={t(
                                                'happening_form.fields.map.title',
                                            )}
                                            placeholder={t(
                                                'happening_form.fields.map.placeholder',
                                            )}
                                            required
                                        />
                                    ) : (
                                        <InputWithLabel
                                            errors={errors}
                                            className={{
                                                container: 'max-w-[256px]',
                                            }}
                                            register={register('teamSize')}
                                            label={t(
                                                'happening_form.fields.team_size.title',
                                            )}
                                            placeholder={t(
                                                'happening_form.fields.team_size.placeholder',
                                            )}
                                            required
                                            type="number"
                                            min={2}
                                            max={64}
                                        />
                                    )}
                                </div>
                                <div className="flex justify-between mt-4 w-full">
                                    <InputWithLabel
                                        errors={errors}
                                        className={{
                                            container: 'max-w-[256px]',
                                        }}
                                        register={register('startDate')}
                                        label={t(
                                            'happening_form.fields.start_date.title',
                                        )}
                                        required
                                        type="date"
                                    />
                                    <InputWithLabel
                                        errors={errors}
                                        className={{
                                            container: 'max-w-[256px]',
                                        }}
                                        register={register('startTime')}
                                        label={t(
                                            'happening_form.fields.start_time.title',
                                        )}
                                        required
                                        type="time"
                                        pattern="[0-9]{2}:[0-9]{2}"
                                    />
                                </div>
                            </div>
                            {type == Happenings.Event && (
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
                                        {t('happening_form.add_end_time')}
                                    </label>
                                </div>
                            )}
                            {type == Happenings.Event && isEndFieldsVisible && (
                                <div className="flex justify-between mt-4">
                                    <InputWithLabel
                                        errors={errors}
                                        className={{
                                            container: 'max-w-[256px]',
                                        }}
                                        register={register('endDate')}
                                        label={t(
                                            'happening_form.fields.end_date.title',
                                        )}
                                        required
                                        type="date"
                                    />
                                    <InputWithLabel
                                        errors={errors}
                                        className={{
                                            container: 'max-w-[256px]',
                                        }}
                                        register={register('endTime')}
                                        label={t(
                                            'happening_form.fields.end_time.title',
                                        )}
                                        required
                                        type="time"
                                        pattern="[0-9]{2}:[0-9]{2}"
                                    />
                                </div>
                            )}
                            <TextareaWithLabel
                                className={{ container: 'mt-5' }}
                                register={register('description')}
                                label={t(
                                    'happening_form.fields.description.title',
                                )}
                                placeholder={t(
                                    'happening_form.fields.description.placeholder',
                                )}
                            />
                            {type == Happenings.Event && (
                                <div>
                                    <div>
                                        <label
                                            htmlFor="coverImage"
                                            className="uppercase mt-[15px] text-[12px]"
                                        >
                                            Cover image
                                        </label>
                                        {!previewUrl && (
                                            <>
                                                <input
                                                    {...register('thumbnail', {
                                                        onChange: (e) => {
                                                            if (
                                                                e?.target?.files
                                                                    ?.length
                                                            ) {
                                                                setValue(
                                                                    'thumbnail',
                                                                    e.target
                                                                        .files[0],
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
                                                    onClick={() =>
                                                        ref?.current?.click()
                                                    }
                                                    type="button"
                                                    styleType="filled"
                                                >
                                                    {t(
                                                        'happening_form.upload_thumbnail',
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                        {previewUrl && (
                                            <>
                                                <img
                                                    src={previewUrl}
                                                    className="mt-2.5 w-full object-cover rounded-[10px] max-h-[100px]"
                                                />
                                                <Button
                                                    styleType="filled"
                                                    className="mt-2"
                                                    onClick={removeThumbnail}
                                                >
                                                    {t(
                                                        'happening_form.remove_thumbnail',
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Carousel>
                </div>
                <div className="flex justify-between px-5 py-6 bg-[#1A1714] rounded-b-[10px]">
                    <Button
                        styleType={'bordered'}
                        onClick={() => onClose(clearErrors)}
                    >
                        {t('close')}
                    </Button>
                    <div className="flex">
                        {cur > 0 && (
                            <Button styleType="bordered" onClick={prev}>
                                {t('back')}
                            </Button>
                        )}
                        {cur == (carouselRef.current?.count() || 0) ? (
                            <Button
                                key="submit"
                                styleType={'filled'}
                                type="submit" /*disabled={isSubmitButtonDisabled}*/
                                className="ml-5"
                            >
                                {t(
                                    mode == ModalMode.Create
                                        ? 'create'
                                        : 'update',
                                )}
                            </Button>
                        ) : (
                            <Button
                                key="next"
                                styleType="filled"
                                onClick={next}
                            >
                                {t('next')}
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
}
