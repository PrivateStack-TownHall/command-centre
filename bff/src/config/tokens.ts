/** Injection token for the resolved list of applications. */
export const APPLICATIONS_TOKEN = Symbol("APPLICATIONS");

/** Injection token for the clock, so tests can control time. */
export const CLOCK_TOKEN = Symbol("CLOCK");

export type Clock = () => Date;
