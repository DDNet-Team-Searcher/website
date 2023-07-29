'use client';

import { useAppSelector } from '../../utils/hooks/hooks'

export function Hints() {
    const hints = useAppSelector(state => state.hints.hints)

    return (
        <div className='fixed right-5 bottom-5 z-10'>
            {hints.map((hint, id) => {
                return (
                    <div className='flex items-center bg-primary-2 p-2.5 mt-4 rounded-[10px] min-w-[250px] animate-[1s_fade-up_4s_forwards,1s_fade-down]' key={id}>
                        {hint.type === 'error' && <img className='max-w-[30px] max-h-[40px]' src='/error-hint.png' />}
                        {hint.type === 'success' && <img className='max-w-[30px] max-h-[40px]' src='/success-hint.png' />}
                        {/* TODO: Add info hint*/}
                        <p className='ml-2.5 text-[white]/80'>{hint.text}</p>
                    </div>
                )
            })}
        </div>
    )
}
