import { useAppSelector } from '@/utils/hooks/hooks';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
// import Authed from './_authed';
// import Guest from './_guest';
const Authed = dynamic(() => import('./_authed'));
const Guest = dynamic(() => import('./_guest'));

export default function Home() {
    const isAuthed = useAppSelector((state) => state.user.isAuthed);
    console.log("Authed", isAuthed);
    if(!!isAuthed) {
        return <Authed/>;
    } else if(isAuthed === false) {
        return <Guest/>;
    } else {
        // here can be fancy loader but just text is also enough
        return <p>Loading...</p>;
    }
}

export const getServerSideProps: GetServerSideProps<{ test: true }> = async (
    ctx,
) => {
    console.log(ctx.query);

    return {
        props: {
            test: true,
        },
    };
};
