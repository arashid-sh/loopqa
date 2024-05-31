export const environments = {
  whqa: 'https://qa.womenshealth.ecmapps.com/',
  mhqa: 'https://qa.menshealth.ecmapps.com/',
  cosmoqa: 'https://qa.cosmopolitan.ecmapps.com/',
};

/**
 * This sets the baseURL given the TEST_ENV environment variable
 * @returns `string` The correct base url from the object enviornments based on which TEST_ENV is passed in.
 */
export function setEnvironment(): string {
  try {
    return environments[process.env.TEST_ENV!];
  } catch {
    throw Error('Invalid TEST_ENV enviornment variable');
  }
}
