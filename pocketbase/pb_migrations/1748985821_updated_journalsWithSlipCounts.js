/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("87s8cpf3uhw1w9k")

  // update collection data
  unmarshal({
    "name": "tagsWithSlipCounts",
    "viewQuery": "SELECT\n  t.id, \n  t.user,\n  t.name, \n  t.colour,\n  t.icon,\n  COUNT(st.value) as totalSlips\nFROM \n  slips as s,\n  JSON_EACH(s.tags) as st\nRIGHT JOIN tags as t on t.id = st.value\nGROUP BY t.name"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_G9EM")

  // remove field
  collection.fields.removeById("_clone_0rvj")

  // remove field
  collection.fields.removeById("_clone_FCoB")

  // remove field
  collection.fields.removeById("_clone_PJYN")

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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("87s8cpf3uhw1w9k")

  // update collection data
  unmarshal({
    "name": "journalsWithSlipCounts",
    "viewQuery": "SELECT\n  j.id, \n  j.user,\n  j.name, \n  j.colour,\n  j.icon,\n  COUNT(sj.value) as totalSlips\nFROM \n  slips as s,\n  JSON_EACH(s.journals) as sj\nRIGHT JOIN journals as j on j.id = sj.value\nGROUP BY j.name"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_G9EM",
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
    "id": "_clone_0rvj",
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
    "id": "_clone_FCoB",
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
    "id": "_clone_PJYN",
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

  // remove field
  collection.fields.removeById("_clone_O6ah")

  // remove field
  collection.fields.removeById("_clone_6abz")

  // remove field
  collection.fields.removeById("_clone_pRJD")

  // remove field
  collection.fields.removeById("_clone_npBc")

  return app.save(collection)
})
