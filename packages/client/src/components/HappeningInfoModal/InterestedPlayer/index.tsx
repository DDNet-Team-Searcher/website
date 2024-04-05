import { Run, Event, Status } from '@app/shared/types/Happening.type';
import {
    CreateReviewResponse,
    InterestedPlayer as InterestedPlayerT,
} from '@app/shared/types/api.type';
import classNames from 'classnames';
import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/Button';
import { TextareaWithLabel } from '@/components/ui/TextareaWithLabel';
import { useForm } from 'react-hook-form';
import { RadioInput } from '@/components/ui/RadioInput';
import { useCreateReviewMutation } from '@/features/api/happenings.api';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { ExcludeSuccess } from '@app/shared/types/Response.type';

type OwnProps = {
    user: InterestedPlayerT;
    happening: Run | Event;
    authedUserId: number;
    onChange: (...args: Array<any>) => () => void;
    alreadyReviewed: boolean;
};

type FormFields = {
    rate: null | string;
    text: string;
};

export function InterestedPlayer({
    user,
    happening,
    authedUserId,
    onChange,
    alreadyReviewed,
}: OwnProps) {
    const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
    const handleFormerror = useHandleFormError();
    const [reviewed, setReviewed] = useState(false);
    const [createReview] = useCreateReviewMutation();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormFields>({
        defaultValues: {
            rate: null,
            text: '',
        },
    });

    const onSubmit = async (values: FormFields) => {
        try {
            await createReview({
                happeningId: happening.id,
                userId: user.user.id,
                data: {
                    text: !!values.text ? values.text : null,
                    rate: parseInt(values.rate!),
                },
            }).unwrap();
            setIsReviewFormVisible(false);
            setReviewed(true);
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<CreateReviewResponse>;
            handleFormerror(error);
        }
    };

    return (
        <li
            className={classNames(
                'group rounded-md transition-colors [&:not(.active)]:hover:bg-[#3F362B]',
                { 'active bg-[#6e5e47]': user.inTeam },
            )}
        >
            <div className="flex items-center cursor-pointer rounded-md mt-1">
                {happening.author.id == authedUserId && (
                    <input
                        className="ml-2.5 my-2.5"
                        type="checkbox"
                        name="interestedPlayers"
                        checked={user.inTeam}
                        onChange={onChange(happening.author.id, user.user.id)}
                        readOnly={user.user.id == happening.author.id}
                    />
                )}
                <Link href={`/profile/${user.user.id}`} className="py-2.5 ml-4">
                    <Avatar
                        src={user.user.avatar}
                        username={user.user.username}
                    />
                </Link>
                <span className="ml-2.5">{user.user.username}</span>
                <Button
                    className={classNames(
                        'ml-auto !p-1.5 mr-1 hidden group-hover:block',
                        {
                            'group-hover:hidden':
                                isReviewFormVisible ||
                                reviewed ||
                                user.user.id === authedUserId ||
                                happening.status !== Status.Finished ||
                                alreadyReviewed,
                        },
                    )}
                    onClick={() => setIsReviewFormVisible(true)}
                    styleType="filled"
                >
                    Leave a review
                </Button>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={classNames(
                    'p-2.5',
                    { hidden: !isReviewFormVisible },
                    { block: isReviewFormVisible },
                )}
            >
                <p className="text-[12px] uppercase">
                    How many Tees out of 5 does he/SHE/IT/THEY/WHateverthefuck
                    deserves <span className="text-[red]">*</span>
                </p>
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((num, id) => (
                        <div
                            className="flex [&:not(:first-child)]:ml-5 items-center"
                            key={id}
                        >
                            <RadioInput
                                register={register('rate')}
                                value={num.toString()}
                                id={'lol'}
                            />
                            <label
                                htmlFor={id.toString()}
                                className="ml-1.5 cursor-pointer"
                            >
                                {num}
                            </label>
                        </div>
                    ))}
                    <p
                        className={classNames(
                            'ml-5 text-error text-[12px]',
                            { hidden: !!!errors.rate?.message },
                            { block: !!errors.rate?.message },
                        )}
                    >
                        &#60;--- you have to choose smth here
                    </p>
                </div>
                <TextareaWithLabel
                    register={register('text')}
                    label="Describe your teammate however you want"
                    className={{ container: 'mt-3' }}
                    placeholder="This mf killed my before fkcing finish. -1000 social credit"
                />
                <div className="flex mt-4 justify-end">
                    <Button
                        styleType="bordered"
                        onClick={() => setIsReviewFormVisible(false)}
                    >
                        Cancel
                    </Button>
                    <Button className="ml-5" type="submit" styleType="filled">
                        Submit
                    </Button>
                </div>
            </form>
        </li>
    );
}
