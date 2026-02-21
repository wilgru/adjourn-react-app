/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("87s8cpf3uhw1w9k")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  t.id, \n  t.user,\n  t.name, \n  t.colour,\n  t.icon,\n  t.tagGroup,\n  t.journal,\n  COUNT(nt.value) as totalNotes\nFROM \n  notes as n,\n  JSON_EACH(n.tags) as nt\nRIGHT JOIN tags as t on t.id = nt.value\nGROUP BY t.name"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_tBvG")

  // remove field
  collection.fields.removeById("_clone_Drw8")

  // remove field
  collection.fields.removeById("_clone_NPLR")

  // remove field
  collection.fields.removeById("_clone_qiQT")

  // remove field
  collection.fields.removeById("_clone_W1B1")

  // remove field
  collection.fields.removeById("_clone_Dv3a")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_k3dN",
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
    "id": "_clone_QKUy",
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
    "id": "_clone_2Axw",
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
    "id": "_clone_fI6u",
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
    "cascadeDelete": false,
    "collectionId": "pbc_931089151",
    "hidden": false,
    "id": "_clone_QDL8",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tagGroup",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1407978968",
    "hidden": false,
    "id": "_clone_J3QM",
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
  const collection = app.findCollectionByNameOrId("87s8cpf3uhw1w9k")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  t.id, \n  t.user,\n  t.name, \n  t.colour,\n  t.icon,\n  t.topicGroup,\n  t.journal,\n  COUNT(nt.value) as totalNotes\nFROM \n  notes as n,\n  JSON_EACH(n.tags) as nt\nRIGHT JOIN tags as t on t.id = nt.value\nGROUP BY t.name"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_tBvG",
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
    "id": "_clone_Drw8",
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
    "id": "_clone_NPLR",
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
    "id": "_clone_qiQT",
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
    "cascadeDelete": false,
    "collectionId": "pbc_931089151",
    "hidden": false,
    "id": "_clone_W1B1",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "topicGroup",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1407978968",
    "hidden": false,
    "id": "_clone_Dv3a",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "journal",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_k3dN")

  // remove field
  collection.fields.removeById("_clone_QKUy")

  // remove field
  collection.fields.removeById("_clone_2Axw")

  // remove field
  collection.fields.removeById("_clone_fI6u")

  // remove field
  collection.fields.removeById("_clone_QDL8")

  // remove field
  collection.fields.removeById("_clone_J3QM")

  return app.save(collection)
})
