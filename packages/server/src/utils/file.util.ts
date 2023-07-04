// TODO: fix these imports lel
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const fileType = {
    avatar: process.env.AVATAR_PATH,
    happening: process.env.HAPPENING_PATH,
};

export enum FileTypeEnum {
    Avatar = 'avatar',
    Happening = 'happening',
}

export async function createFile(file: Express.Multer.File, type: string) {
    return new Promise<string>((resolve, reject) => {
        const filename = uuidv4() + path.extname(file.originalname);

        fs.writeFile(
            `.${fileType[type]}/${filename}`,
            file.buffer,
            async (err) => {
                if (err === null) {
                    resolve(filename);
                }

                reject();
            },
        );
    });
}

export async function deleteFile(filename: string, type: string) {
    return new Promise<void>((resolve, reject) => {
        fs.unlink(`.${fileType[type]}/${filename}`, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}
