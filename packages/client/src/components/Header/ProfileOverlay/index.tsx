import classNames from "classnames";
import Link from "next/link";
import { MutableRefObject, Ref, forwardRef } from "react";

const links = {
    '/profile': 'Your profile',
    '/happenings': 'Your happenings',
    '/settings/account': 'Settings',
    '/kek': 'Sign out',
}

type OwnProps = {
    isHidden: boolean;
    ref: MutableRefObject<HTMLUListElement | null>;
};

//NOTE: do smth with it? XD
/* eslint-disable react/display-name */
export const ProfileOverlay = forwardRef(({ isHidden }: OwnProps, ref: Ref<HTMLUListElement>) => {
    return (
        <ul data-id="profile-overlay" ref={ref} className={classNames(
            "absolute w-[200px] right-0 top-full mt-3 rounded-[10px] bg-primary-3 px-5",
            { "hidden": isHidden }
        )}>
            {Object.keys(links).map((link, id) => (
                <li key={id} className="mt-4 last-of-type:mb-4 text-medium-emphasis hover:!text-high-emphasis"><Link href={link}>{links[link as keyof typeof links]}</Link></li>
            ))}
        </ul>
    );
});
