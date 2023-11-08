export function getAvatarUrl(avatar: string | null): string | null {
    if (avatar) {
        avatar = `${process.env.AVATAR_URL}/${avatar}`;
    }

    return avatar;
}
