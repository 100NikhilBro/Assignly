import helmet from "helmet";

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://accounts.google.com/gsi/client",
        "https://apis.google.com",
        "'unsafe-inline'",
      ],

      connectSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://oauth2.googleapis.com",
        "https://www.googleapis.com",
      ],

      frameSrc: [
        "https://accounts.google.com",
      ],

      imgSrc: [
        "'self'",
        "data:",
        "https://lh3.googleusercontent.com",
      ],
    },
  },

  crossOriginOpenerPolicy: {
    policy: "same-origin-allow-popups",
  },
});
