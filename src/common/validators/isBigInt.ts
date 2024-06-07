import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsBigInt(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      name: 'IsBigInt',
      target: target.constructor,
      propertyName: propertyName,
      constraints: [validationOptions],
      options: {
        message:
          validationOptions?.message ??
          `${propertyName} is not a valid bigint number`,
      },
      validator: {
        validate(value: any) {
          try {
            BigInt(value);
            return true;
          } catch (error) {
            return false;
          }
        },
      },
    });
  };
}
