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

export type ProfileReview = {
    id: number;
    review: string | null;
    createdAt: string;
    rate: number;
    author: {
        id: number;
        username: string;
        avatar: string | null;
    };
};
