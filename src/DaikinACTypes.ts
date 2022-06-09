export const Power: { [key: string]: boolean } = {
    OFF: false,
    ON: true,
};

export const Mode: { [key: string]: number } = {
    AUTO: 0,
    AUTO1: 1,
    AUTO2: 7,
    DEHUMDID: 2,
    COLD: 3,
    HOT: 4,
    FAN: 6,
};

export enum SpecialModeState {
    OFF = 0,
    ON = 1,
}
export enum SpecialModeKind {
    STREAMER = 0, // Flash STREAMER Air-Purifier
    POWERFUL = 1, // POWERFUL Operation
    ECONO = 2, // ECONO Operation
}

export const SpecialModeResponse: { [key: string]: string } = {
    'N/A': '',
    POWERFUL: '2',
    ECONO: '12',
    STREAMER: '13',
    'POWERFUL/STREAMER': '2/13',
    'ECONO/STREAMER': '12/13',
};

export const FanRate: { [key: string]: number | 'A' | 'B' } = {
    AUTO: 'A',
    SILENCE: 'B',
    LEVEL_1: 3,
    LEVEL_2: 4,
    LEVEL_3: 5,
    LEVEL_4: 6,
    LEVEL_5: 7,
};

export const FanDirection: { [key: string]: number } = {
    STOP: 0,
    VERTICAL: 1,
    HORIZONTAL: 2,
    VERTICAL_AND_HORIZONTAL: 3,
};

export const ErrorCode: { [key: string]: number } = {
    OK: 0,
};

export const Type: { [key: string]: string } = {
    AC: 'aircon',
    // ...
};

export const AdpMode: { [key: string]: string } = {
    RUN: 'run',
};

export const Method: { [key: string]: string } = {
    POLLING: 'polling',
};
