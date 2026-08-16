export const handler = async (event) => {
  return {
    statusCode: 303,
    headers: {
      "Location": "https://triratna.directory",
      "Set-Cookie": `jwt=; Domain=${process.env.COOKIE_DOMAIN}; Expires=${new Date(0).toUTCString()}`
    }
  }
};