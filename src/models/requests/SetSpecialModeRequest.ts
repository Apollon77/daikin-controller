import {RequestDict} from "./index";

export enum SpecialModeState {
  OFF = 0,
  ON = 1,
}
export enum SpecialModeKind {
  STREAMER = 0, // Flash STREAMER Air-Purifier
  POWERFUL = 1, // POWERFUL Operation
  ECONO = 2, // ECONO Operation
}

export class SetSpecialModeRequest {
  private readonly state: number;
  private readonly kind: number;

  public constructor(state: SpecialModeState, kind: SpecialModeKind) {
    this.state = state;
    this.kind = kind;
  }

  public getRequestDict(): RequestDict {
    if(this.kind === SpecialModeKind.STREAMER) {
      return {"en_streamer": this.state};
    }
    const dict: RequestDict = {};
    dict['set_spmode'] = this.state;
    dict['spmode_kind'] = this.kind;
    return dict;
  }
}
