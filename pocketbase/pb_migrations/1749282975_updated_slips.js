/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("75h1r0vz3gvycqp")

  // update collection data
  unmarshal({
    "name": "notes"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("75h1r0vz3gvycqp")

  // update collection data
  unmarshal({
    "name": "slips"
  }, collection)

  return app.save(collection)
})
