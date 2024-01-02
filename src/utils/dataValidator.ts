import { z, ZodTypeAny, ZodError, ZodType } from "zod";

class DataValidator {
  static validateAndCreate<T>(data: unknown, schema: ZodTypeAny): T | null {
    try {
      if (!this.validate(data, schema)) {
        return null;
      }
      return schema.parse(data) as T;
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(error.errors);
      } else {
        console.error("Unexpected error:", error);
      }
      return null;
    }
  }

  static validate(data: unknown, schema: ZodType): boolean {
    return schema.safeParse(data).success;
  }
}

export default DataValidator;
