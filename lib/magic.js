import { Magic } from "@magic-sdk/admin";

// Construct with an API key:
export const magicAdmin = new Magic(process.env.MAGIC_SERVER_KEY);
