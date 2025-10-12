/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("87s8cpf3uhw1w9k")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  t.id, \n  t.user,\n  t.name, \n  t.colour,\n  t.icon,\n  t.journal,\n  COUNT(nt.value) as totalNotes\nFROM \n  notes as n,\n  JSON_EACH(n.tags) as nt\nRIGHT JOIN tags as t on t.id = nt.value\nGROUP BY t.name"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_cV9s")

  // remove field
  collection.fields.removeById("_clone_ZNLu")

  // remove field
  collection.fields.removeById("_clone_0ePK")

  // remove field
  collection.fields.removeById("_clone_f7DV")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_BmAV",
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
    "id": "_clone_XbdA",
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
    "id": "_clone_dFSn",
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
    "id": "_clone_ezZU",
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
    "collectionId": "pbc_1407978968",
    "hidden": false,
    "id": "_clone_Qf0b",
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
    "viewQuery": "SELECT\n  t.id, \n  t.user,\n  t.name, \n  t.colour,\n  t.icon,\n  COUNT(nt.value) as totalNotes\nFROM \n  notes as n,\n  JSON_EACH(n.tags) as nt\nRIGHT JOIN tags as t on t.id = nt.value\nGROUP BY t.name"
  }, collection)

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

  // remove field
  collection.fields.removeById("_clone_BmAV")

  // remove field
  collection.fields.removeById("_clone_XbdA")

  // remove field
  collection.fields.removeById("_clone_dFSn")

  // remove field
  collection.fields.removeById("_clone_ezZU")

  // remove field
  collection.fields.removeById("_clone_Qf0b")

  return app.save(collection)
})
