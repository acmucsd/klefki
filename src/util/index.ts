import * as discord from "./discord";
import * as calendar from "./calendar";
import * as notion from "./notion";

import totp from "totp-generator";

const validateAuthToken = (token: string) => {
  const validateFormat = token.match(/^Bearer .{6}$/g);
  if (validateFormat?.length !== 1) return false;
  const accessToken = token.split(" ")[1];
  const key = process.env.TOTP_KEY as string;
  const totpValue = totp(key);
  return accessToken === totpValue;
};

export { discord, calendar, notion, validateAuthToken };
