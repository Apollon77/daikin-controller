export const Power: { [key: string]: boolean } = {
  OFF: false,
  ON: true,
};

export const SpecialModeResponse: { [key: string]: string } = {
  'N/A': '',
  POWERFUL: '2',
  ECONO: '12',
  STREAMER: '13',
  'POWERFUL/STREAMER': '2/13',
  'ECONO/STREAMER': '12/13',
};

export const FanDirection: { [key: string]: number } = {
  STOP: 0,
  VERTICAL: 1,
  HORIZONTAL: 2,
  VERTICAL_AND_HORIZONTAL: 3,
};
