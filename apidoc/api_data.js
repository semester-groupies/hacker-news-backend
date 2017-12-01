define({ "api": [
  {
    "type": "get",
    "url": "/",
    "title": "Returns memory usage information for the server",
    "group": "Index",
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Index",
    "name": "Get"
  },
  {
    "type": "get",
    "url": "/count",
    "title": "Returns the total number of Stories",
    "group": "Index",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>total count of stories</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Index",
    "name": "GetCount"
  },
  {
    "type": "get",
    "url": "/item/:id",
    "title": "Returns a story or comment by id",
    "group": "Index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the story/comment to return.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "results",
            "description": "<p>JSON containing the story/comment</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Index",
    "name": "GetItemId"
  },
  {
    "type": "get",
    "url": "/latest",
    "title": "Returns the latest hanesst_id",
    "group": "Index",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "hanesst_id",
            "description": "<p>Hanesst_id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Index",
    "name": "GetLatest"
  },
  {
    "type": "get",
    "url": "/stories",
    "title": "Returns the stories for the feed, 20 at a time",
    "group": "Index",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "results",
            "description": "<p>JSON containing 20 stories, with comments</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Index",
    "name": "GetStories"
  },
  {
    "type": "post",
    "url": "/user/login",
    "title": "Log in a User",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password of the User.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "JWT",
            "description": "<p>JWT containing information about the user.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "name": "PostUserLogin"
  },
  {
    "type": "post",
    "url": "/user/register",
    "title": "Register and Log in a new User",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password of the User.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "JWT",
            "description": "<p>JWT containing information about the user.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "name": "PostUserRegister"
  }
] });
