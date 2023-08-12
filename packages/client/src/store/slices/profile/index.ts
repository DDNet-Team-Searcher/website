import { Status } from '@/types/Happenings.type';
import { Nullable } from '@/types/Nullable.type';
import { Profile } from '@/types/Profile.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Nullable<Profile> = {
    happenings: {
        runs: [],
        events: [],
    },
    id: null,
    tier: null,
    roles: [],
    _count: {
        followers: null,
        following: null,
        playedRuns: null,
        playedEvents: null,
    },
    avatar: null,
    reviews: [],
    username: null,
    verified: null,
    createdAt: null,
    isFollowing: null,
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile(_, action: PayloadAction<Profile>) {
            return action.payload;
        },
        setHappeningStatus(
            state,
            action: PayloadAction<{
                id: number;
                type: 'run' | 'event';
                status: Status;
            }>,
        ) {
            const type = (action.payload.type + 's') as 'events' | 'runs';

            //@ts-ignore NOTE: idk how to write it in other way :p
            state.happenings[type] = state.happenings[type].map((happening) => {
                if (happening.id == action.payload.id) {
                    happening.status = action.payload.status;
                }

                return happening;
            });
        },
        deleteHappening(
            state,
            action: PayloadAction<{ id: number; type: 'event' | 'run' }>,
        ) {
            const type = (action.payload.type + 's') as 'events' | 'runs';

            //@ts-ignore NOTE: idk how to write it in other way :p
            state.happenings[type] = [...state.happenings[type]].filter(
                (happening) => happening.id !== action.payload.id,
            );
        },
        setIsInterestedInHappening(
            state,
            action: PayloadAction<{
                type: 'run' | 'event';
                id: number;
                isInterested: boolean;
            }>,
        ) {
            const type = (action.payload.type + 's') as 'runs' | 'events';
            const happening = [...state.happenings[type]].filter(
                (happening) => happening.id === action.payload.id,
            )[0];

            if (action.payload.isInterested) {
                happening.interestedPlayers.push({ inTeam: false });
            } else {
                happening.interestedPlayers.pop();
            }

            happening._count.interestedPlayers =
                happening._count.interestedPlayers! +
                (action.payload.isInterested ? 1 : -1);
        },
    },
});

export const {
    setProfile,
    deleteHappening,
    setHappeningStatus,
    setIsInterestedInHappening
} = profileSlice.actions;

export default profileSlice.reducer;
