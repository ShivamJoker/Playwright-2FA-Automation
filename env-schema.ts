import { z, TypeOf } from "zod";
const zodEnv = z.object({
  USER_NAME: z.string(),
  PASSWORD: z.string(),
  TOTP_URI: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof zodEnv> {}
  }
}

const parseSchmea = () => {
  try {
    zodEnv.parse(process.env);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const { fieldErrors } = err.flatten();
      const errorMessage = Object.entries(fieldErrors)
        .map(([field, errors]) =>
          errors ? `${field}: ${errors.join(", ")}` : field,
        )
        .join("\n  ");
      throw new Error(`Missing environment variables:\n  ${errorMessage}`);
    }
  }
};

export default parseSchmea;
