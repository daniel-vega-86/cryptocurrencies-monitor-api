const validateUpdate = (body, allowedUpdates) => {
  const updates = Object.keys(body);

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    throw new Error("Invalid update.");
  }
};

module.exports = validateUpdate;
