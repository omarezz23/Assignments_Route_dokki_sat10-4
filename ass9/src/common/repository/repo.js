export const create = async ({
  data,
  options,
  model
}) => {
  return await model.create(data, options) || [];
}

export const findOne = async ({
  filter,
  options,
  select,
  model
} = {}) => {
  const doc = model.findOne(filter).select(select || "");
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
}

export const findById = async ({
  id,
  options,
  select,
  model
}) => {
  const doc = model.findById(id).select(select || "");
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
}


export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true },
  model

}) => {
  return await model.findByIdAndUpdate(
    id,
    { ...update, $inc: { __v: 1 } },
    options
  );
}
