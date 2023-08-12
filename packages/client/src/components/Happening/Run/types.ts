import { Run } from '@/types/Happenings.type';
import { BaseHappeningProps } from '../types';

export type RunProps = BaseHappeningProps & {
    run: Run;
};
