export default {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;

    // let's do a 20% discount everytime
    event.params.data.price = event.params.data.price * 0.8;
  },
  async beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    console.log("beforeUpdate");
    const page = await strapi.query("api::page.page").findMany({
      where: { id: where.id },
      populate: {
        parent: {
          select: ["id", "fullpath"],
        },
      },
    });
    if (page[0].parent?.fullpath) {
      const path = data.fullpath?.split("/")?.splice(-1, 1) || data.handle;
      event.params.data.fullpath = page[0].parent.fullpath + "/" + path;
    }
    return;
  },
  afterCreate(event) {
    const { result, params } = event;

    // do something to the result;
  },
};
