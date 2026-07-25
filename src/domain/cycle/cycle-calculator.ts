import {
  addDays,
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
} from "date-fns";

import type {
  BreakDay,
  CycleBoundaries,
  CycleConfiguration,
  CycleDay,
  DoseDay,
  IsoDate,
} from "./cycle-types";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_FORMAT = "yyyy-MM-dd";

export class CycleDomainError extends Error {
  override readonly name = "CycleDomainError";
}

export class CycleCalculator {
  readonly #configuration: Readonly<CycleConfiguration>;
  readonly #startDate: Date;
  readonly #cycleLength: number;

  constructor(configuration: CycleConfiguration) {
    this.#startDate = parseIsoDate(configuration.startDate, "startDate");
    assertPositiveInteger(configuration.pillsPerCycle, "pillsPerCycle");
    assertNonNegativeInteger(configuration.breakDays, "breakDays");
    assertPositiveInteger(configuration.pillsPerPack, "pillsPerPack");
    assertTimeZone(configuration.timeZone);

    this.#configuration = Object.freeze({ ...configuration });
    this.#cycleLength =
      configuration.pillsPerCycle + configuration.breakDays;
  }

  calculate(referenceDate: IsoDate): CycleDay {
    const parsedReferenceDate = parseIsoDate(referenceDate, "referenceDate");
    const daysFromStart = differenceInCalendarDays(
      parsedReferenceDate,
      this.#startDate,
    );

    if (daysFromStart < 0) {
      return {
        kind: "before-treatment",
        referenceDate,
        treatmentStartDate: this.#configuration.startDate,
        daysUntilStart: Math.abs(daysFromStart),
      };
    }

    const cycleIndex = Math.floor(daysFromStart / this.#cycleLength);
    const dayInCycle = daysFromStart % this.#cycleLength;
    const boundaries = this.#getBoundaries(cycleIndex);

    if (dayInCycle < this.#configuration.pillsPerCycle) {
      return this.#createDoseDay(referenceDate, dayInCycle, boundaries);
    }

    return this.#createBreakDay(referenceDate, dayInCycle, boundaries);
  }

  calculateAt(instant: Date): CycleDay {
    if (!isValid(instant)) {
      throw new CycleDomainError("instant must be a valid Date");
    }

    const referenceDate = toIsoDateInTimeZone(
      instant,
      this.#configuration.timeZone,
    );

    return this.calculate(referenceDate);
  }

  #getBoundaries(cycleIndex: number): CycleBoundaries {
    const cycleStart = addDays(
      this.#startDate,
      cycleIndex * this.#cycleLength,
    );
    const useEnd = addDays(
      cycleStart,
      this.#configuration.pillsPerCycle - 1,
    );
    const hasBreak = this.#configuration.breakDays > 0;

    return {
      cycleNumber: cycleIndex + 1,
      cycleStartDate: formatIsoDate(cycleStart),
      useEndDate: formatIsoDate(useEnd),
      breakStartDate: hasBreak ? formatIsoDate(addDays(useEnd, 1)) : null,
      breakEndDate: hasBreak
        ? formatIsoDate(addDays(useEnd, this.#configuration.breakDays))
        : null,
      nextCycleStartDate: formatIsoDate(
        addDays(cycleStart, this.#cycleLength),
      ),
    };
  }

  #createDoseDay(
    referenceDate: IsoDate,
    dayInCycle: number,
    boundaries: CycleBoundaries,
  ): DoseDay {
    const sequenceNumber = dayInCycle + 1;

    return {
      kind: "dose",
      referenceDate,
      ...boundaries,
      sequenceNumber,
      pillsPerCycle: this.#configuration.pillsPerCycle,
      packNumber:
        Math.floor((sequenceNumber - 1) / this.#configuration.pillsPerPack) + 1,
      pillInPack:
        ((sequenceNumber - 1) % this.#configuration.pillsPerPack) + 1,
      totalPacks: Math.ceil(
        this.#configuration.pillsPerCycle /
          this.#configuration.pillsPerPack,
      ),
    };
  }

  #createBreakDay(
    referenceDate: IsoDate,
    dayInCycle: number,
    boundaries: CycleBoundaries,
  ): BreakDay {
    return {
      kind: "break",
      referenceDate,
      ...boundaries,
      breakDayNumber:
        dayInCycle - this.#configuration.pillsPerCycle + 1,
      breakDays: this.#configuration.breakDays,
    };
  }
}

function parseIsoDate(value: IsoDate, fieldName: string): Date {
  const parsedDate = parseISO(value);

  if (
    !ISO_DATE_PATTERN.test(value) ||
    !isValid(parsedDate) ||
    formatIsoDate(parsedDate) !== value
  ) {
    throw new CycleDomainError(
      `${fieldName} must be a valid ISO date in yyyy-MM-dd format`,
    );
  }

  return parsedDate;
}

function formatIsoDate(date: Date): IsoDate {
  return format(date, ISO_DATE_FORMAT);
}

function assertPositiveInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new CycleDomainError(`${fieldName} must be a positive integer`);
  }
}

function assertNonNegativeInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new CycleDomainError(
      `${fieldName} must be a non-negative integer`,
    );
  }
}

function assertTimeZone(timeZone: string): void {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
  } catch {
    throw new CycleDomainError("timeZone must be a valid IANA time zone");
  }
}

function toIsoDateInTimeZone(instant: Date, timeZone: string): IsoDate {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const partsByType = new Map(
    dateParts.map(({ type, value }) => [type, value]),
  );

  return `${partsByType.get("year")}-${partsByType.get("month")}-${partsByType.get("day")}`;
}
