import { Static, TObject } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export function configValidator<T extends TObject>(schema: T) {
  type ConfigSchema = Static<T>;
  const validator = TypeCompiler.Compile(schema);

  return function validateConfig(
    values: Record<string, unknown>,
  ): ConfigSchema {
    if (validator.Check(values)) {
      return values;
    } else {
      const errors = [...validator.Errors(values)];
      console.error("Configuration errors:", errors);
      throw new Error("Invalid configuration");
    }
  };
}
