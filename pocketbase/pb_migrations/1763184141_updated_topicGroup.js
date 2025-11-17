/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_931089151")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1407978968",
    "hidden": false,
    "id": "relation3249006413",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "journal",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_931089151")

  // remove field
  collection.fields.removeById("relation3249006413")

  return app.save(collection)
})
