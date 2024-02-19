exports.zodErrorHandle = (schema) => (
  req,
  res,
  next,
) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors[0].message });
  }
};
