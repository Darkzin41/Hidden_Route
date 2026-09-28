import jwt from "jsonwebtoken";

export const SESSION_COOKIE = "hidden_route_session";

export function createTokenService(secret) {
  return {
    sign(admin) {
      return jwt.sign(
        {
          sub: String(admin.id),
          email: admin.email,
          name: admin.name,
          role: "admin",
        },
        secret,
        { expiresIn: "8h", issuer: "hidden-route" },
      );
    },
    verify(token) {
      return jwt.verify(token, secret, { issuer: "hidden-route" });
    },
  };
}
