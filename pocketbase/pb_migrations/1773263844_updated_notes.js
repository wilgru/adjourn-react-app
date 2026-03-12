/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("75h1r0vz3gvycqp")

  // remove field
  collection.fields.removeById("pfftyfhl")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "zyykuufo",
    "name": "isBookmarked",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("75h1r0vz3gvycqp")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "pfftyfhl",
    "name": "isPinned",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "zyykuufo",
    "name": "isFlagged",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
