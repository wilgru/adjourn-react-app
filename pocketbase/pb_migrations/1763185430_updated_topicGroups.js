/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_931089151")

  // remove field
  collection.fields.removeById("relation2448836153")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_931089151")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "35y5ayizwh2c9fk",
    "hidden": false,
    "id": "relation2448836153",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "topics",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
