export default function crudRepository(model) {
  return {
    create: async function (data) {
      const newDoc = await model.create(data);
      return newDoc;
    },
    getAll: async function () {
      const doc = await model.find();
      return doc;
    },
    getById: async function (id) {
      const doc = await model.findById(id);
      return doc;
    },
    delete: async function (id) {
      const response = await model.findByIdAndDelete(id);
      return response;
    },
    update: async function (id, data) {
      const updatedDoc = await model.findByIdAndUpdate(id, user, {
        new: true
      });
      return updatedDoc;
    }
  };
}
