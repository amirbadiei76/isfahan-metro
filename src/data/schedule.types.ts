export type StationSchedule = {
  stationId: number;
  times: string[];
};

export type DirectionSchedule = {
  from: string;
  to: string;
  stations: StationSchedule[];
  // [stationName: string]: string[];
};

export type DaySchedule = {
  qods_to_sofeh: DirectionSchedule;
  sofeh_to_qods: DirectionSchedule;
};

export interface Schedule {
  weekdays: DaySchedule;
  holidays: DaySchedule;
}
