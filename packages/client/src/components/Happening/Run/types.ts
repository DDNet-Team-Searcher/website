import { Run } from '@app/shared/types/Happening.type';
import { BaseHappeningProps } from '../types';

export type RunProps = BaseHappeningProps & {
    run: Run;
};
