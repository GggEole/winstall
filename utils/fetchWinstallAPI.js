/**
 * Helper method for requesting resources from the winstall-api.
 * @param {*} path - path of the resource
 * @param {*} givenOptions - any additional header options
 * @param {*} throwErr - flag to indicate whether an error should be thrown
 * @returns 
 */
const fetchWinstallAPI = async (path, givenOptions, throwErr) => {
  const url = `${process.env.NEXT_PUBLIC_WINGET_API_BASE}${path}`;

  let additionalOptions = { ...givenOptions };
  let headerOptions;

  if (additionalOptions) {
    headerOptions = { ...givenOptions?.headers };
    delete additionalOptions["headers"];
  }

  let response, error;

  try {
    const res = await fetch(url, {
      headers: {
        AuthKey: process.env.NEXT_PUBLIC_WINGET_API_KEY,
        AuthSecret: process.env.NEXT_PUBLIC_WINGET_API_SECRET,
        ...headerOptions,
      },
      ...additionalOptions,
      redirect: "follow",
    });


    if (!res.ok) {
      // if `throwErr` is true we fail deployments
      if (throwErr) {
        throw new Error((await res.json()).error);
      }

      error = (await res.json()).error;
    } else {
      response = await res.json();
    }
  } catch (err) {
    error = err.message;

    // if `throwErr` is true we fail deployments
    if (throwErr) {
      throw new Error(err);
    }
  }

  return { response, error };
};

module.exports = fetchWinstallAPI;
