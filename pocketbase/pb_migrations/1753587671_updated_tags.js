/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("35y5ayizwh2c9fk")

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1340419796",
    "hidden": false,
    "id": "relation2029409178",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "badges",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("35y5ayizwh2c9fk")

  // remove field
  collection.fields.removeById("relation2029409178")

  return app.save(collection)
})
