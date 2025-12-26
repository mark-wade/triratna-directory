export const handler = async (event) => {
  return {
    statusCode: 303,
    headers: {
      "Location": "https://triratna.directory",
    }
  }
};