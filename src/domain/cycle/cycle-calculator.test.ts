import { describe, expect, it } from "vitest";

import { CycleCalculator, CycleDomainError } from "./cycle-calculator";
import type { CycleConfiguration, DoseDay } from "./cycle-types";

const referenceConfiguration: CycleConfiguration = {
  startDate: "2026-04-25",
  pillsPerCycle: 120,
  breakDays: 4,
  pillsPerPack: 30,
  timeZone: "America/Sao_Paulo",
};

describe("CycleCalculator", () => {
  it("matches the reference 120 + 4 cycle", () => {
    const calculator = new CycleCalculator(referenceConfiguration);

    expect(calculator.calculate("2026-07-24")).toEqual({
      kind: "dose",
      referenceDate: "2026-07-24",
      cycleNumber: 1,
      cycleStartDate: "2026-04-25",
      useEndDate: "2026-08-22",
      breakStartDate: "2026-08-23",
      breakEndDate: "2026-08-26",
      nextCycleStartDate: "2026-08-27",
      sequenceNumber: 91,
      pillsPerCycle: 120,
      packNumber: 4,
      pillInPack: 1,
      totalPacks: 4,
    });
  });

  it.each([
    ["2026-04-25", 1, 1, 1],
    ["2026-05-24", 30, 1, 30],
    ["2026-05-25", 31, 2, 1],
    ["2026-06-23", 60, 2, 30],
    ["2026-06-24", 61, 3, 1],
    ["2026-07-23", 90, 3, 30],
    ["2026-07-24", 91, 4, 1],
    ["2026-08-22", 120, 4, 30],
  ])(
    "calculates pack transitions on %s",
    (referenceDate, sequenceNumber, packNumber, pillInPack) => {
      const calculator = new CycleCalculator(referenceConfiguration);
      const result = calculator.calculate(referenceDate) as DoseDay;

      expect(result.kind).toBe("dose");
      expect(result.sequenceNumber).toBe(sequenceNumber);
      expect(result.packNumber).toBe(packNumber);
      expect(result.pillInPack).toBe(pillInPack);
    },
  );

  it("calculates the first and last break days", () => {
    const calculator = new CycleCalculator(referenceConfiguration);

    expect(calculator.calculate("2026-08-23")).toMatchObject({
      kind: "break",
      cycleNumber: 1,
      breakDayNumber: 1,
      breakDays: 4,
    });
    expect(calculator.calculate("2026-08-26")).toMatchObject({
      kind: "break",
      cycleNumber: 1,
      breakDayNumber: 4,
      nextCycleStartDate: "2026-08-27",
    });
  });

  it("restarts the sequence after the break", () => {
    const calculator = new CycleCalculator(referenceConfiguration);

    expect(calculator.calculate("2026-08-27")).toMatchObject({
      kind: "dose",
      cycleNumber: 2,
      cycleStartDate: "2026-08-27",
      sequenceNumber: 1,
      packNumber: 1,
      pillInPack: 1,
    });
  });

  it("reports dates before the treatment starts", () => {
    const calculator = new CycleCalculator(referenceConfiguration);

    expect(calculator.calculate("2026-04-23")).toEqual({
      kind: "before-treatment",
      referenceDate: "2026-04-23",
      treatmentStartDate: "2026-04-25",
      daysUntilStart: 2,
    });
  });

  it("supports cycles without a break", () => {
    const calculator = new CycleCalculator({
      ...referenceConfiguration,
      pillsPerCycle: 2,
      breakDays: 0,
    });

    expect(calculator.calculate("2026-04-26")).toMatchObject({
      kind: "dose",
      cycleNumber: 1,
      sequenceNumber: 2,
      breakStartDate: null,
      breakEndDate: null,
      nextCycleStartDate: "2026-04-27",
    });
    expect(calculator.calculate("2026-04-27")).toMatchObject({
      kind: "dose",
      cycleNumber: 2,
      sequenceNumber: 1,
    });
  });

  it("handles leap days and month transitions", () => {
    const calculator = new CycleCalculator({
      ...referenceConfiguration,
      startDate: "2024-02-28",
      pillsPerCycle: 2,
      breakDays: 1,
    });

    expect(calculator.calculate("2024-02-29")).toMatchObject({
      kind: "dose",
      sequenceNumber: 2,
      useEndDate: "2024-02-29",
    });
    expect(calculator.calculate("2024-03-01")).toMatchObject({
      kind: "break",
      breakDayNumber: 1,
    });
    expect(calculator.calculate("2024-03-02")).toMatchObject({
      kind: "dose",
      cycleNumber: 2,
      sequenceNumber: 1,
    });
  });

  it("handles year transitions", () => {
    const calculator = new CycleCalculator({
      ...referenceConfiguration,
      startDate: "2026-12-31",
      pillsPerCycle: 1,
      breakDays: 1,
    });

    expect(calculator.calculate("2027-01-01")).toMatchObject({
      kind: "break",
      breakDayNumber: 1,
      nextCycleStartDate: "2027-01-02",
    });
  });

  it("uses the treatment time zone to derive the business date", () => {
    const calculator = new CycleCalculator(referenceConfiguration);

    expect(
      calculator.calculateAt(new Date("2026-04-25T02:59:59.000Z")),
    ).toMatchObject({
      kind: "before-treatment",
      referenceDate: "2026-04-24",
    });
    expect(
      calculator.calculateAt(new Date("2026-04-25T03:00:00.000Z")),
    ).toMatchObject({
      kind: "dose",
      referenceDate: "2026-04-25",
      sequenceNumber: 1,
    });
  });

  it.each([
    ["startDate", { startDate: "25/04/2026" }],
    ["pillsPerCycle", { pillsPerCycle: 0 }],
    ["pillsPerCycle", { pillsPerCycle: 1.5 }],
    ["breakDays", { breakDays: -1 }],
    ["breakDays", { breakDays: 1.5 }],
    ["pillsPerPack", { pillsPerPack: 0 }],
    ["timeZone", { timeZone: "Invalid/TimeZone" }],
  ])("rejects an invalid %s", (_, change) => {
    expect(
      () =>
        new CycleCalculator({
          ...referenceConfiguration,
          ...change,
        }),
    ).toThrow(CycleDomainError);
  });

  it("rejects invalid reference dates and instants", () => {
    const calculator = new CycleCalculator(referenceConfiguration);

    expect(() => calculator.calculate("2026-02-30")).toThrow(
      /referenceDate must be a valid ISO date/i,
    );
    expect(() => calculator.calculateAt(new Date(Number.NaN))).toThrow(
      /instant must be a valid Date/i,
    );
  });
});
