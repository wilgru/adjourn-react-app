/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("35y5ayizwh2c9fk")

  // update field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_931089151",
    "hidden": false,
    "id": "relation3385817711",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tagGroup",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("35y5ayizwh2c9fk")

  // update field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_931089151",
    "hidden": false,
    "id": "relation3385817711",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "topicGroup",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
