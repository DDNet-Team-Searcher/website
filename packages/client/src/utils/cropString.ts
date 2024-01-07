export function cropString(string: string, maxLen: number): string {
    if (string.length > maxLen) {
        return string.slice(0, maxLen) + '...';
    } else {
        return string;
    }
}
