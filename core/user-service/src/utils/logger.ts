import winston from "winston";

const logger = winston.createLogger({
  // 1. set level to "info"
  // 2. format: JSON + timestamp
  // 3. add console transport
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
