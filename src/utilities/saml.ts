import { IdentityProvider, ServiceProvider } from "saml2-js";

const serviceProvider = new ServiceProvider({
  entity_id: process.env.BASE_URL ?? "https://triratna.directory",
  private_key: "",
  certificate: "",
  assert_endpoint:
    (process.env.API_URL
      ? process.env.API_URL
      : "https://api.triratna.directory") + "/acs",
});
const identityProvider = new IdentityProvider({
  sso_login_url:
    process.env.SSO_LOGIN_URL ??
    "https://sso.triratna.co/saml2/idp/SSOService.php",
  sso_logout_url:
    process.env.SSO_LOGOUT_URL ??
    "https://sso.triratna.co/saml2/idp/SingleLogoutService.php",
  certificates: "",
});

export function samlLogin(callback: (error: any, login_url: string) => void) {
  serviceProvider.create_login_request_url(
    identityProvider,
    {},
    callback
  );
}

export function samlLogout(name_id: string, callback: (error: any, logout_url: string) => void) {
  serviceProvider.create_logout_request_url(
    identityProvider,
    { name_id },
    callback
  );
}