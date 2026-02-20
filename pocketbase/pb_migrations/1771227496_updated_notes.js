/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("75h1r0vz3gvycqp")

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2602490748",
    "hidden": false,
    "id": "relation1347970455",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "tasks",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("75h1r0vz3gvycqp")

  // remove field
  collection.fields.removeById("relation1347970455")

  return app.save(collection)
})
