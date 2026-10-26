import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

/** Passes only if the given ISO date is at least `minAge` years in the past. */
export function IsMinAge(minAge: number, options?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      name: 'isMinAge',
      target: object.constructor,
      propertyName,
      options,
      constraints: [minAge],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const dob = new Date(value);
          if (Number.isNaN(dob.getTime())) return false;
          const cutoff = new Date();
          cutoff.setFullYear(cutoff.getFullYear() - args.constraints[0]);
          return dob <= cutoff;
        },
        defaultMessage(args: ValidationArguments) {
          return `Student must be at least ${args.constraints[0]} years old`;
        },
      },
    });
}
