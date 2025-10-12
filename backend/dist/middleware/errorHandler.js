export class BetterError extends Error {
    statusCode;
    code;
    name;
    constructor(message, statusCode, code, name) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = name;
    }
}
export const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        code: err.code || "INTERNAL_SERVER_ERROR",
        name: err.name || "Error",
    });
};
