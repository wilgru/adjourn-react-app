/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1407978968")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "75h1r0vz3gvycqp",
    "hidden": false,
    "id": "relation18589324",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "notes",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2602490748",
    "hidden": false,
    "id": "relation1347970455",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "tasks",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1407978968")

  // remove field
  collection.fields.removeById("relation18589324")

  // remove field
  collection.fields.removeById("relation1347970455")

  return app.save(collection)
})
