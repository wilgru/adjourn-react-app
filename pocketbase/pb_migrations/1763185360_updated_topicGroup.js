/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_931089151")

  // update collection data
  unmarshal({
    "name": "topicGroups"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_931089151")

  // update collection data
  unmarshal({
    "name": "topicGroup"
  }, collection)

  return app.save(collection)
})
