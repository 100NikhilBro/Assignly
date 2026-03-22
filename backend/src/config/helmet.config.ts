import helmet from "helmet";

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://apis.google.com",
        "'unsafe-inline'",
      ],

      connectSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://oauth2.googleapis.com",
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

  crossOriginOpenerPolicy: false,
});
