/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("87s8cpf3uhw1w9k")

  // update collection data
  unmarshal({
    "name": "tagsWithNoteCounts",
    "viewQuery": "SELECT\n  t.id, \n  t.user,\n  t.name, \n  t.colour,\n  t.icon,\n  COUNT(nt.value) as totalNotes\nFROM \n  notes as n,\n  JSON_EACH(n.tags) as nt\nRIGHT JOIN tags as t on t.id = nt.value\nGROUP BY t.name"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_O6ah")

  // remove field
  collection.fields.removeById("_clone_6abz")

  // remove field
  collection.fields.removeById("_clone_pRJD")

  // remove field
  collection.fields.removeById("_clone_npBc")

  // remove field
  collection.fields.removeById("number1248411780")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_cV9s",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_ZNLu",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "_clone_0ePK",
    "maxSelect": 1,
    "name": "colour",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "red",
      "orange",
      "yellow",
      "lime",
      "green",
      "blue",
      "cyan",
      "pink",
      "purple",
      "brown",
      "grey"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_f7DV",
    "max": 0,
    "min": 0,
    "name": "icon",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3823594094",
    "max": null,
    "min": null,
    "name": "totalNotes",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("87s8cpf3uhw1w9k")

  // update collection data
  unmarshal({
    "name": "tagsWithSlipCounts",
    "viewQuery": "SELECT\n  t.id, \n  t.user,\n  t.name, \n  t.colour,\n  t.icon,\n  COUNT(st.value) as totalSlips\nFROM \n  slips as s,\n  JSON_EACH(s.tags) as st\nRIGHT JOIN tags as t on t.id = st.value\nGROUP BY t.name"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_O6ah",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_6abz",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "_clone_pRJD",
    "maxSelect": 1,
    "name": "colour",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "red",
      "orange",
      "yellow",
      "lime",
      "green",
      "blue",
      "cyan",
      "pink",
      "purple",
      "brown",
      "grey"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_npBc",
    "max": 0,
    "min": 0,
    "name": "icon",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1248411780",
    "max": null,
    "min": null,
    "name": "totalSlips",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("_clone_cV9s")

  // remove field
  collection.fields.removeById("_clone_ZNLu")

  // remove field
  collection.fields.removeById("_clone_0ePK")

  // remove field
  collection.fields.removeById("_clone_f7DV")

  // remove field
  collection.fields.removeById("number3823594094")

  return app.save(collection)
})
