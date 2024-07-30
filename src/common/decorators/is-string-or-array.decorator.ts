import {
  ValidationOptions,
  isArray,
  isString,
  registerDecorator,
} from 'class-validator';

export function IsStringOrArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            isString(value) ||
            (isArray(value) && value.every((item) => isString(item)))
          );
        },
      },
    });
  };
}
