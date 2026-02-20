/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2602490748")

  // update field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "75h1r0vz3gvycqp",
    "hidden": false,
    "id": "relation1871664426",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "note",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2602490748")

  // update field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "75h1r0vz3gvycqp",
    "hidden": false,
    "id": "relation1871664426",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "Note",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
