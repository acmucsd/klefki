import got, {GotOptions} from "got";

const acmurlUsername = process.env.ACMURL_USERNAME as string
const acmurlPassword = process.env.ACMURL_PASSWORD as string;

/**
 * Add an ACMURL. Makes one HTTP call to YOURLS' API.
 *
 * @param shortlink The short link to make an ACMURL for.
 * @param longlink The link to point it to.
 * @param title Title of ACMURL in YOURLS interface.
 * @private
 * @returns The new shortened ACMURL.
 */
export async function addACMURL(shortlink: string, longlink: string, title: string): Promise<string> {
  const acmurlAPIResponse = await got.post('https://acmurl.com/yourls-api.php', {
    form: {
      username: acmurlUsername,
      password: acmurlPassword,
      action: 'shorturl',
      keyword: shortlink,
      url: longlink,
      format: 'json',
      title,
    },
  } as GotOptions<any>);
  const acmurlAPIData = JSON.parse(acmurlAPIResponse.body);

  if (acmurlAPIData.status === 'fail') {
    throw new Error(acmurlAPIData.code);
  }
  return acmurlAPIData.shorturl;
}

/**
 * Handle an existing ACMURL by updating it properly.
 * @param shortlink The short link to make an ACMURL for.
 * @param longlink The link to point it to.
 * @param title Title of ACMURL in YOURLS interface.
 * @private
 * @returns Tuple of old URL on YOURLS and new ACMURL.
 */
export async function handleExistingACMURL(shortlink: string, longlink: string, title: string): Promise<[string, string]> {
  // get the old URL
  const previousURL = await expandACMURL(shortlink);
  // Add the new one.
  await updateACMURL(shortlink, longlink, title);
  return [previousURL, `https://acmurl.com/${shortlink}`];
}

/**
 * Get the link that is redirected from a given ACMURL. Makes one HTTP call to YOURLS' API.
 * @param shortlink The short link to check the ACMURL for.
 * @private
 * @returns the link that `acmurl.com/shortlink` points to.
 */
async function expandACMURL(shortlink: string): Promise<string> {
  const acmurlAPIResponse = await got
    .post('https://acmurl.com/yourls-api.php', {
      form: {
        username: acmurlUsername,
        password: acmurlPassword,
        action: 'expand',
        shorturl: shortlink,
        format: 'json',
      },
    } as GotOptions<any>);
  const acmurlAPIData = JSON.parse(acmurlAPIResponse.body);
  return acmurlAPIData !== undefined ? acmurlAPIData.longurl : undefined;
}

/**
 * Overwrite the current ACMURL with a new one. Makes one HTTP call to YOURLS' API.
 * @param shortlink The short link to make an ACMURL for.
 * @param longlink The link to point it to.
 * @param title Title of ACMURL in YOURLS interface.
 * @private
 */
async function updateACMURL(shortlink: string, longlink: string, title: string): Promise<void> {
  await got.post('https://acmurl.com/yourls-api.php', {
    form: {
      username: acmurlUsername,
      password: acmurlPassword,
      action: 'update',
      shorturl: shortlink,
      url: longlink,
      format: 'json',
      title,
    },
  } as GotOptions<any>);
}