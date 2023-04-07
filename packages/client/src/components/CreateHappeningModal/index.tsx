import { useCreateEventMutation, useCreateRunMutation } from "@/features/api/happenings.api";
import { addHappening } from "@/store/slices/happenings";
import { hint } from "@/store/slices/hints";
import { CreateEventResponse, CreateRunResponse } from "@/types/api.type";
import { Happenings } from "@/types/Happenings.type";
import { ExcludeSuccess } from "@/types/Response.type";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import classNames from "classnames";
import { useRef, useState } from "react"
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { InputWithLabel } from "../ui/InputWithLabel";
import { Modal } from "../ui/Modal";
import { RadioInput } from "../ui/RadioInput";
import { TextareaWithLabel } from "../ui/TextareaWithLabel";
// import { Button } from "../../../components/ui/Button"
// import { Modal } from "../../../components/ui/Modal"
// import { setIsCreateEventModalHidden, setIsCreateRunModalHidden } from "../../../store/slices/app"
// import { hint } from "../../../store/slices/hints"
// import { CreateEventForm } from "../../../types/CreateEventForm.type"
// import { CreateRunForm } from "../../../types/CreateRunForm.type"
// import { composeValidators } from "../../../utils/composeValidators"
// import { useAppDispatch, useAppSelector } from "../../../utils/hooks/hooks"
// import { required } from "../../../utils/validators/required"
// import { InputWithLabel } from "../InputWithLabel"
// import { RadioInput } from "../RadioInput"
// import { TextareaWithLabel } from "../TextareaWithLabel"

type OwnProps = {
    isVisible: boolean;
    onClose: () => void;
    type: 'run' | 'event';
}

// const gimmeInitialValues = <T extends string = "run" | "event">(type: T): T extends "run" ? CreateRunForm : CreateEventForm => {
//     if (type == "run") {
//         return {
//             place: null,
//             mapName: "",
//             teamSize: "",
//             runStartDate: new Date().toISOString().substring(0, 10),
//             runStartTime: new Date().toLocaleTimeString(navigator.language, { hour12: false }).substring(0, 5),
//             description: ""
//         } as T extends "run" ? CreateRunForm : CreateEventForm
//     } else {
//         return {
//             place: null,
//             mapName: "",
//             teamSize: "",
//             eventStartDate: new Date().toISOString().substring(0, 10),
//             eventStartTime: new Date().toLocaleTimeString(navigator.language, { hour12: false }).substring(0, 5),
//             eventEndDate: "",
//             eventEndTime: "",
//             description: "",
//             thumbnail: ""
//         } as T extends "run" ? CreateRunForm : CreateEventForm
//     }
// }

export const CreateHappeningModal = ({ type, isVisible, onClose }: OwnProps) => {
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)
    const [createRun] = useCreateRunMutation()
    const [createEvent] = useCreateEventMutation()
    const dispatch = useAppDispatch()
    // const availableMaps = useAppSelector(state => state.app.maps)
    const ref = useRef<null | HTMLInputElement>(null)
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
        thumbnail: null as null | File
    };
    const { setError, handleSubmit, register, setValue, formState: { errors } } = useForm({
        defaultValues
    });

    // type Happening = CreateEventForm | CreateRunForm

    // const initialValues = gimmeInitialValues(type)

    // const validatePlaceField = (value: string | number | null) => composeValidators(value, [required])
    // const validateTeamsizeField = (value: string | number) => composeValidators(value, [required])
    // const validateMapNameField = (value: string | number) => composeValidators(value, [required])
    //
    // const validation = (values: Happening) => {
    //     const errors: { [key in keyof Partial<CreateRunForm>]: any } = {}
    //
    //     const placeField = validatePlaceField(values.place)
    //     const teamSizeField = validateTeamsizeField(values.teamSize)
    //     const mapNameField = validateMapNameField(values.mapName)
    //
    //     if (placeField) errors.place = placeField
    //     if (teamSizeField) errors.teamSize = teamSizeField
    //     if (mapNameField) errors.mapName = mapNameField
    //
    //     if (!Object.keys(errors).length) setIsSubmitButtonDisabled(false)
    //     else setIsSubmitButtonDisabled(true)
    //
    //     return errors
    // }

    // const onSubmit = async (values: Happening, { resetForm }: FormikHelpers<Happening>) => {
    //     try {
    //         let res
    //
    //         if (type == "run") { // I will send a run
    //             res = await createRun(values as CreateRunForm).unwrap()
    //
    //             dispatch(setIsCreateRunModalHidden(true))
    //         } else { // I will send an event
    //             const formData = new FormData()
    //
    //             Object.keys(values).map((key) => {
    //                 formData.append(key, values[key as keyof Happening] || "")
    //             })
    //
    //             res = await createEvent(formData).unwrap()
    //
    //             dispatch(setIsCreateEventModalHidden(true))
    //         }
    //
    //         // resetForm()
    //
    //         if (typeof res.data === "string") {
    //             dispatch(hint({ type: "success", text: res.data }))
    //         } else {
    //             // idk what to do here xD
    //         }
    //     } catch (err: any) {
    //         if ("data" in err) {
    //             if (typeof err.data === "string") {
    //                 dispatch(hint({ type: "error", text: err.data }))
    //             } else {
    //                 // show an error above fields
    //             }
    //         }
    //     }
    // }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEndFieldsVisible(e.target.checked)
    }

    const onSubmit = async (values: typeof defaultValues) => {
        console.log(type)
        if (type === 'event') {
            console.log(values)
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
                // console.log(values.place === "HERE" ? 0 : 1);
                const eventData: EventDataT = {
                    place: values.place === "HERE" ? 0 : 1,
                    title: values.title,
                    mapName: values.mapName,
                    description: values.description ?? null,
                    startAt: values.startDate + ' ' + values.startTime,
                    thumbnail: values.thumbnail
                };

                if (endAt.trim() !== '') {
                    eventData.endAt = endAt;
                }

                const res = await createEvent(eventData).unwrap();

                if (res.status === 'success') {
                    onClose();
                    dispatch(addHappening({ type: Happenings.Event, happening: res.data.event }));
                }
            } catch (err) {
                const error = (err as FetchBaseQueryError).data as ExcludeSuccess<CreateEventResponse>

                if (error.status === 'fail') {
                    for (let [key, value] of Object.entries(error.data ?? {})) {
                        setError(key as keyof typeof error.data, { message: value });
                    }

                    if ("message" in error && error.message !== undefined) {
                        dispatch(hint({ type: "error", text: error.message }));
                    }
                } else if (error.status === 'error') {
                    dispatch(hint({ type: "error", text: error.message }));
                }
            }
        } else if (type === 'run') {
            try {
                const res = await createRun({
                    place: values.place === "HERE" ? 0 : 1,
                    description: values.description ?? null,
                    teamSize: parseInt(values.teamSize),
                    mapName: values.mapName,
                    startAt: values.startDate + ' ' + values.startTime
                }).unwrap();

                if (res.status === 'success') {
                    onClose();
                    dispatch(addHappening({ type: Happenings.Run, happening: res.data.run }));
                }
            } catch (err) {
                const error = (err as FetchBaseQueryError).data as ExcludeSuccess<CreateRunResponse>

                if (error.status === 'fail') {
                    for (let [key, value] of Object.entries(error.data ?? {})) {
                        setError(key as keyof typeof error.data, { message: value });
                    }

                    if ("message" in error && error.message !== undefined) {
                        dispatch(hint({ type: "error", text: error.message }));
                    }
                } else if (error.status === 'error') {
                    dispatch(hint({ type: "error", text: error.message }));
                }
            }
        }
    }

    const inputs = [
        {
            title: "Somewhere else.",
            subtitle: "You can get team and go play on official DDnet servers.",
            value: "THERE"
        },
        {
            title: "Our own shitty servers.",
            subtitle: "You will have less change to get ddosed.",
            value: "HERE"
        }
    ]

    return (
        <Modal className={"create-run"} visible={isVisible} onClose={onClose} width={"600px"}>
            <p className="text-3xl m-0 pt-6 px-5">Create your own {type}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-6">
                    <div>
                        <p className="text-xl mt-5" style={{ "margin": "40px 0 0" }}>Where's your {type}?</p>
                        <p className={"text-sm mt-1 text-high-emphasis"}>So noone gets lost on where to go?</p>

                        {['THERE', 'HERE'].map(val => (
                            <div className="flex items-center py-[5px] px-2.5 rounded-[5px] bg-primary-3 mt-5">
                                <RadioInput title={"Our own servers."} value="HERE" subtitle={"You will have less change to get ddosed."} id={val} register={register('place')} className={{ wrapper: "mt-5" }} />
                                <label htmlFor={val} className={classNames("ml-2.5 grow-[1]")}>
                                    {/*
                                    <p className={"font-medium"}>{title}</p>
                                    <p className={"text-[12px] text-medium-emphasis"}>{subtitle}</p>
                                    */}
                                    <p className={"font-medium"}>{"LOL"}</p>
                                    <p className={"text-[12px] text-medium-emphasis"}>KEK</p>
                                </label>
                            </div>
                        ))}
                        {/*
                        <RadioInput title={"Somewhere else."} value="THERE" subtitle={"You can get team and go play on official DDnet servers."} id="other" register={register('place')} className={{ wrapper: "mt-5" }} />
                        <RadioInput title={"Our own servers."} value="HERE" subtitle={"You will have less change to get ddosed."} id="own" register={register('place')} className={{ wrapper: "mt-5" }} />
                        */}
                    </div>
                    <div>
                        <p className={"text-xl mt-5"}>Tell us more about your {type}</p>
                        <p className={"text-sm mt-1 text-high-emphasis"}>Fill fields down below!</p>
                        <div className="flex justify-between mt-4">
                            {/*<<Field className="max-w-[256px] w-full" name="mapName" label="map name" datalist={availableMaps.map(map => map.name)}
                                id="mapName" placeholder={"Map you're gonna play?"} required component={InputWithLabel} />
                            <Field className="max-w-[256px] w-full" name="teamSize" label="team size" type={"number"} id="teamSize"
                                placeholder={"What team size do you want?"} required
                                component={InputWithLabel} />
                                */}
                            {type === 'event' ?
                                <InputWithLabel className={{ container: "max-w-[256px]" }} register={register('title')} label="event title" placeholder="How would you name event?" required />
                                :
                                <InputWithLabel className={{ container: "max-w-[256px]" }} register={register('mapName')} label="map name" placeholder="Map you're gonna play?" required />
                            }
                            {type === 'event' ?
                                <InputWithLabel className={{ container: "max-w-[256px]" }} register={register('mapName')} label="map name" placeholder="Map you're gonna play?" required />
                                :
                                <InputWithLabel className={{ container: "max-w-[256px]" }} register={register('teamSize')} label="team size" placeholder="What team size do you want?" required type="number" min={2} max={64} />
                            }
                        </div>
                        <div className="flex justify-between mt-4 w-full">
                            {/*<Field className="max-w-[256px] w-full" name={`${type}StartDate`} label={`${type} start date`} type={"date"} id={`${type}StartDate`}
                                required component={InputWithLabel} />
                            <Field className="max-w-[256px] w-full" name={`${type}StartTime`} pattern="[0-9]{2}:[0-9]{2}" label={`${type} start time`}
                                type={"time"} id={`${type}StartTime`} required component={InputWithLabel} />
                                */}
                            <InputWithLabel className={{ container: "max-w-[256px]" }} register={register('startDate')} label="start date" required type="date" />
                            <InputWithLabel className={{ container: "max-w-[256px]" }} register={register('startTime')} label="start time" required type="time" pattern="[0-9]{2}:[0-9]{2}" />
                        </div>
                    </div>
                    {type == "event" &&
                        <div className="mt-5 flex content-center">
                            <input onChange={onChange} className="appearance-none w-4 h-4 bg-[rgba(0,0,0,.45)] bordered-[2px] checked:bg-[url('/check-mark.png')] bg-no-repeat bg-center" id="show-end-fields" type="checkbox" />
                            <label htmlFor="show-end-fields" className="text-[12px] uppercase ml-2.5">Add end date & time</label>
                        </div>
                    }
                    {type == "event" && isEndFieldsVisible &&
                        <div className="flex justify-between mt-4">
                            {/*
                            <Field className="max-w-[256px] w-full" name="eventEndDate" label="event end date" type={"date"} id="eventEndDate"
                                required component={InputWithLabel} />
                            <Field className="max-w-[256px] w-full" name="eventEndTime" pattern="[0-9]{2}:[0-9]{2}" label="event end time"
                                type={"time"} id="eventEndTime" required component={InputWithLabel} />
                                */}
                            <InputWithLabel className={{ container: "max-w-[256px]" }} register={register('endDate')} label="end date" required type="date" />
                            <InputWithLabel className={{ container: "max-w-[256px]" }} register={register('endTime')} label="end time" required type="time" pattern="[0-9]{2}:[0-9]{2}" />
                        </div>
                    }
                    {/*
                    <Field label={"description"} className="mt-5 [&_textarea]:resize-none" name={"description"}
                        placeholder={"Here you can describe a teammate of dream, are weebs people or whatever you want"}
                        component={TextareaWithLabel} />
                        */}
                    <TextareaWithLabel className={{ container: "mt-5" }} register={register('description')} label="Description" placeholder="Here you can describe a teammate of dream, are weebs people or whatever you want" />
                    {type == "event" &&
                        <div>
                            <div>
                                <label htmlFor="coverImage" className="uppercase mt-[15px] text-[12px]">Cover image</label>
                                {/*
                                <Field component={({ form: { setFieldValue } }: any) => {
                                    return <input ref={ref} id="coverImage" onChange={(e) => {
                                        if (e?.target?.files?.length) {
                                            setFieldValue("thumbnail", e.target.files[0])
                                        }
                                    }} type="file" style={{ display: "none" }} />
                                }} />
                                */}
                                <input {...register('thumbnail', {
                                    onChange: (e) => {
                                        if (e?.target?.files?.length) {
                                            setValue('thumbnail', e.target.files[0]);
                                        }
                                    }
                                })} ref={ref} type="file" className="hidden" />
                                <Button className="mt-2.5" onClick={() => ref?.current?.click()} type="button" styleType="filled">Upload cover image</Button>
                            </div>
                        </div>
                    }
                </div>
                <div className="flex justify-between mt-6 px-5 py-6 bg-[#1A1714] rounded-b-[10px]">
                    <Button styleType={"bordered"}
                        onClick={onClose}>Close</Button>
                    <Button styleType={"filled"} type={"submit"} /*disabled={isSubmitButtonDisabled}*/>Create {type}</Button>
                </div>
            </form>
        </Modal>
    )
}
