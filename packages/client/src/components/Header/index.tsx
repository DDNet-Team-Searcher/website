import { Button } from "@/components/ui/Button"
import Link from "next/link"
import classNames from "classnames"
import { useAppDispatch, useAppSelector } from "@/utils/hooks/hooks"
import { useRef, useState } from "react"
import { useGetCredentialsQuery } from "@/features/api/users.api"
import { Avatar } from "../Avatar"
import { useOutsideClickHandler } from "@/utils/hooks/useClickedOutside"
import { setIsCreateEventModalHidden, setIsCreateRunModalHidden } from "@/store/slices/app"
import { CreateHappeningModal } from "../CreateHappeningModal"

export const Header = () => {
    const dispatch = useAppDispatch();
    const ref = useRef<null | HTMLDivElement>(null);
    const [isCreateSelectionMenuHidden, setIsSelectionMenuHidden] =
        useState(true);
    const isAuthed = useAppSelector((state) => state.user.isAuthed);
    const [currentHappening, setCurrentHappening] = useState<'run' | 'event' | null>(null)
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
    const { username, avatar } = useAppSelector((state) => state.user.user);
    useGetCredentialsQuery();

    const onOutsideClick = () => {
        setIsSelectionMenuHidden(true);
    };

    useOutsideClickHandler(ref, !isCreateSelectionMenuHidden, onOutsideClick);

    const createRun = () => {
        setCurrentHappening('run');
        setIsCreateModalVisible(true);
        // setIsSelectionMenuHidden(true);
        // dispatch(setIsCreateRunModalHidden(false))
    };

    const createEvent = () => {
        setCurrentHappening('event')
        setIsCreateModalVisible(true);
        // setIsSelectionMenuHidden(true);
        // dispatch(setIsCreateEventModalHidden(false))
    };

    const onCreateHappeningModalClose = () => {
        setCurrentHappening(null);
        setIsCreateModalVisible(false);
    }

    return (
        <header className={classNames("py-5 w-full z-[1] bg-[rgba(0,0,0,.36)]", { "absolute t-0": !isAuthed })}>
            <CreateHappeningModal isVisible={isCreateModalVisible} onClose={onCreateHappeningModalClose} type={currentHappening as 'run' | 'event'} />
            <div className="flex justify-between items-end max-w-[1110px] mx-auto">
                <Link href={"/"}>
                    <img src='/logo.png' alt="logotype" className={classNames({ "hidden": !isAuthed })} />
                </Link>
                <div className={classNames({ "hidden": isAuthed, "flex items-center [&>:not(:first-child)]:ml-7": !isAuthed })}>
                    <Button styleType='bordered'>
                        <Link href="/register">
                            <img src='/sign-up.png' className="inline-block" alt="sign up icon" /> Sign up
                        </Link>
                    </Button>
                    <Button styleType='filled'><Link href="/login">
                        <img src='/login.png' className="inline-block" alt="login icon" /> Log in
                    </Link>
                    </Button>
                </div>
                <div
                    className={classNames({ "flex items-center": isAuthed, "hidden": !isAuthed })}> {/* authed user part */}
                    <div className="relative">
                        <Button styleType={isCreateSelectionMenuHidden ? "bordered" : "filled"} className={"p-1"} onClick={() => setIsSelectionMenuHidden(!isCreateSelectionMenuHidden)}>
                            <img className="!m-0" src={'/add.svg'} />
                        </Button>
                        <div ref={ref} data-id="header" className={classNames("absolute l-0 min-w-[max(100%,200px)] bg-primary-2 top-[125%] rounded-[10px]", { "hidden": isCreateSelectionMenuHidden })}>
                            <div className="text-[white] px-4 py-2.5 rounded-[10px] transition-all duration-200 cursor-pointer hover:bg-primary-3" onClick={createEvent}>Create event</div>
                            <div className="text-[white] px-4 py-2.5 rounded-[10px] transition-all duration-200 cursor-pointer hover:bg-primary-3" onClick={createRun}>Create run</div>
                        </div>
                    </div>
                    <Button style={{ "border": "0" }} className="!p-0 max-w-[25px] w-full ml-5" styleType={"bordered"}>
                        <img src='/notification.svg' />
                    </Button>
                    <p className="text-[white] mx-5">{username}</p>
                    <Avatar src={avatar} username={username || ""} size={30} />
                </div>
            </div>
        </header>
    )
}
