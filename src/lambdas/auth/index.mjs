import jwt from 'jsonwebtoken';

export const handler = async (event) => {
  return new Promise((resolve) => {
    try {
      const token = event.headers.authorization.replace(/^Bearer /, '');
      jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
          resolve({
            "isAuthorized": false,
            "context": {}
          });
        } else {
          resolve({
            "isAuthorized": true,
            "context": decoded
          });
        }
      });
    } catch (err) {
      resolve({
        "isAuthorized": false,
        "context": {}
      });
    }
  });
};