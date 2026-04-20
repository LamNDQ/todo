// Generic Zod validation middleware
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.errors.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    req.body = result.data; // use parsed/coerced data
    next();
}