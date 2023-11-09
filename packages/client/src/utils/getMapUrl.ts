export function getMapUrl(mapName: string): string {
    const fileName = mapName.replaceAll(' ', '_');
    return `https://ddnet.org/ranks/maps/${fileName}.png`;
}
