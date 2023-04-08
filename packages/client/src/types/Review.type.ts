export type Review = {
    id: number;
    rate: number;
    review: string | null;
    createdAt: string;
    reviewedUser: {
        id: number;
        avatar: string | null;
        username: string;
    };
    author: {
        id: number;
        avatar: string | null;
        username: string;
    };
};
