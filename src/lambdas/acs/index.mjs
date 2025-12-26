import { IdentityProvider, ServiceProvider } from "saml2-js";
import queryString from 'query-string';
import jwt from 'jsonwebtoken';

export const handler = async (event) => {
  const serviceProvider = new ServiceProvider({
    entity_id: process.env.BASE_URL ?? "https://triratna.directory",
    allow_unencrypted_assertion: true,
  });
  const identityProvider = new IdentityProvider({
    certificates: process.env.SAML_IDP_CERTIFICATE.replaceAll('|', '\n')
  });
  const requestBody = queryString.parse(Buffer.from(event.body, 'base64').toString());

  return new Promise((resolve) => {
    serviceProvider.post_assert(identityProvider, {request_body: requestBody}, function(err, saml_response) {
      if (err) {
        console.log(err);
        resolve({
          statusCode: 303,
          headers: {
            "Location": "https://triratna.directory/?loginError=err",
          }
        });
      } else {
        if ( saml_response.user.attributes.om[0] === '1' ) {
          const token = jwt.sign({
            sub: saml_response.user.name_id,
            name: saml_response.user.attributes.username[0],
            photo: saml_response.user.attributes.profile_image_url[0]
          }, process.env.JWT_SECRET);
          resolve({
            statusCode: 303,
            headers: {
              "Location": "https://triratna.directory",
              "Set-Cookie": `jwt=${token}; Domain=${process.env.COOKIE_DOMAIN}; Expires=${new Date(Date.now() + 365 * 86400 * 1000).toUTCString()}`
            }
          });
        } else {
          resolve({
            statusCode: 303,
            headers: {
              "Location": "https://triratna.directory/?loginError=om",
            }
          });
        }
      }
    });
  });  
};