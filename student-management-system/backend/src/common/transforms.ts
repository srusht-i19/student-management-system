import { Transform } from "class-transformer";

/** Removes leading/trailing spaces from string input before validation runs. */
export const Trim = () =>
  Transform(({ value }) => (typeof value === "string" ? value.trim() : value));

/** Trims and lower-cases (used for emails so "A@x.com" and "a@x.com" are the same). */
export const TrimLowercase = () =>
  Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  );
