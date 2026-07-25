export type IsoDate = string;

export interface CycleConfiguration {
  readonly startDate: IsoDate;
  readonly pillsPerCycle: number;
  readonly breakDays: number;
  readonly pillsPerPack: number;
  readonly timeZone: string;
}

export interface CycleBoundaries {
  readonly cycleNumber: number;
  readonly cycleStartDate: IsoDate;
  readonly useEndDate: IsoDate;
  readonly breakStartDate: IsoDate | null;
  readonly breakEndDate: IsoDate | null;
  readonly nextCycleStartDate: IsoDate;
}

export interface BeforeTreatmentDay {
  readonly kind: "before-treatment";
  readonly referenceDate: IsoDate;
  readonly treatmentStartDate: IsoDate;
  readonly daysUntilStart: number;
}

export interface DoseDay extends CycleBoundaries {
  readonly kind: "dose";
  readonly referenceDate: IsoDate;
  readonly sequenceNumber: number;
  readonly pillsPerCycle: number;
  readonly packNumber: number;
  readonly pillInPack: number;
  readonly totalPacks: number;
}

export interface BreakDay extends CycleBoundaries {
  readonly kind: "break";
  readonly referenceDate: IsoDate;
  readonly breakDayNumber: number;
  readonly breakDays: number;
}

export type CycleDay = BeforeTreatmentDay | DoseDay | BreakDay;
