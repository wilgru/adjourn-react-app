/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1340419796")

  // remove field
  collection.fields.removeById("relation2638274075")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1340419796")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "35y5ayizwh2c9fk",
    "hidden": false,
    "id": "relation2638274075",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "topic",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
