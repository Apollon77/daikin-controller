import { RequestDict } from './index';
import { SpecialModeState, SpecialModeKind } from '../../DaikinACTypes';

export class SetSpecialModeRequest {
    private readonly state: number;
    private readonly kind: number;

    public constructor(state: SpecialModeState, kind: SpecialModeKind) {
        if (typeof state !== 'number' || typeof kind !== 'number') {
            throw new Error('Invalid arguments');
        }
        this.state = state;
        this.kind = kind;
    }

    public getRequestDict(): RequestDict {
        if (this.kind === SpecialModeKind.STREAMER) {
            return { en_streamer: this.state };
        }
        const dict: RequestDict = {};
        dict['set_spmode'] = this.state;
        dict['spmode_kind'] = this.kind;
        return dict;
    }
}
