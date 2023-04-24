import { stripHtml } from "string-strip-html";

export function dataSanitize(req, res, next) {
  const data = req.body;
  Object.keys(data).forEach(function (key) {
    if (typeof data[key] === "string") {
      data[key] = stripHtml(data[key]).result.trim();
    }
  });

  req.body = data;
  next();
}
