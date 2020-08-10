define({ "api": [
  {
    "type": "post",
    "url": "/accounts/info",
    "title": "Retrieve accounts information",
    "name": "InfoAccount",
    "group": "Accounts",
    "description": "<p>Retrieve accounts information for chat data hadling.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer &lt;access token&gt;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Body request fields": [
          {
            "group": "Body request fields",
            "type": "String[]",
            "optional": false,
            "field": "users",
            "description": "<p>Users identifier to fetch data (<code>REQUIRED</code>)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>Accounts information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.user",
            "description": "<p>Account unique identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "users.type",
            "description": "<p>Type of the authenticated account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.name",
            "description": "<p>Display name of the authenticated account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.about",
            "description": "<p>Display about of the authenticated account</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error status 401": [
          {
            "group": "Error status 401",
            "type": "Number",
            "optional": false,
            "field": "error",
            "description": "<p>Error number code</p> <p><code>1000</code> The access token isn't valid</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routers/v1/accounts.router.ts",
    "groupTitle": "Accounts"
  },
  {
    "type": "post",
    "url": "/accounts/login",
    "title": "Login account",
    "name": "LoginAccount",
    "group": "Accounts",
    "permission": [
      {
        "name": "'service' to login user account"
      }
    ],
    "description": "<p>Authenticate an account to get an access token to validate requests. The given access token must be used as Bearer token to sign every request to another services.</p> <p>Inspired into the OAuth2 standard, to authenticate an user account the request must be signed with a Bearer token of a service. This schema is more simple and less secure than OAuth2 schema, but its the example idea.</p>",
    "parameter": {
      "fields": {
        "Body request fields": [
          {
            "group": "Body request fields",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of the account (<code>REQUIRED</code>)</p>"
          },
          {
            "group": "Body request fields",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the account (<code>REQUIRED</code>)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "authorization",
            "description": "<p>Bearer &lt;access token&gt;</p>"
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
            "field": "user",
            "description": "<p>Account unique identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the authenticated account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Display name of the authenticated account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "about",
            "description": "<p>Display about of the authenticated account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "roles",
            "description": "<p>Roles granted to the authenticated account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Generated access token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error status 401": [
          {
            "group": "Error status 401",
            "type": "Number",
            "optional": false,
            "field": "error",
            "description": "<p>Error number code</p> <p><code>1000</code> The access token isn't valid</p> <p><code>1001</code> The credentials used to authenticate are invalid</p> <p><code>1002</code> The authenticated account don't holds the required roles</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routers/v1/accounts.router.ts",
    "groupTitle": "Accounts"
  },
  {
    "type": "post",
    "url": "/accounts/logout",
    "title": "Logout account",
    "name": "LogoutAccount",
    "group": "Accounts",
    "description": "<p>Logout an account removing the access token used to sign requests.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer &lt;access token&gt;</p>"
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
            "field": "user",
            "description": "<p>Account unique identifier</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error status 401": [
          {
            "group": "Error status 401",
            "type": "Number",
            "optional": false,
            "field": "error",
            "description": "<p>Error number code</p> <p><code>1000</code> The access token isn't valid</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routers/v1/accounts.router.ts",
    "groupTitle": "Accounts"
  },
  {
    "type": "post",
    "url": "/accounts/register",
    "title": "Register new account",
    "name": "RegisterAccount",
    "group": "Accounts",
    "permission": [
      {
        "name": "'service' to register user account and ['user', 'admin'] to register service or bot account"
      }
    ],
    "description": "<p>Register new account into the service. The service support three types of accounts</p> <p><code>AT_USER = 1</code>  Account for users</p> <p><code>AT_SERVICE = 2</code>  Account for services and applications</p> <p><code>AT_BOT = 3</code>  Account for bots</p> <p>To register an account with type <code>1</code> the request must be authenticated with the role <code>service</code>, but in order to register an account with type <code>2</code> or <code>3</code> the request must be authenticated with the roles <code>admin</code> and <code>user</code>.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer &lt;access token&gt;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Body request fields": [
          {
            "group": "Body request fields",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Full name to display for the new account (<code>REQUIRED</code>)</p>"
          },
          {
            "group": "Body request fields",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address to register the account (<code>REQUIRED</code>)</p>"
          },
          {
            "group": "Body request fields",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>Password to register the account. If the password is omitted then a random password will be generated for the account</p>"
          },
          {
            "group": "Body request fields",
            "type": "String",
            "optional": true,
            "field": "about",
            "description": "<p>Description about the account</p>"
          },
          {
            "group": "Body request fields",
            "type": "Number",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the registered account. Allowed values: <code>AT_USER</code>, <code>AT_SERVICE</code> or <code>AT_BOT</code> (<code>REQUIRED</code>)</p>"
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
            "field": "email",
            "description": "<p>Email address registered for the account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>Password used to register the account. This value will be returned only when a password is autogenerated because it was not sent into the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error status 401": [
          {
            "group": "Error status 401",
            "type": "Number",
            "optional": false,
            "field": "error",
            "description": "<p>Error number code</p> <p><code>1000</code> The access token isn't valid</p> <p><code>1001</code> The credentials used to authenticate are invalid</p> <p><code>1002</code> The authenticated account don't holds the required roles</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routers/v1/accounts.router.ts",
    "groupTitle": "Accounts"
  },
  {
    "type": "get",
    "url": "/accounts/validate",
    "title": "Validate account access token",
    "name": "ValidateAccount",
    "group": "Accounts",
    "description": "<p>Validate an access token to check if its valid. Returns the user information that can be used by external service to validate user permissions.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer &lt;access token&gt;</p>"
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
            "field": "user",
            "description": "<p>Account unique identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the authenticated account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Display name of the authenticated account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "about",
            "description": "<p>Display about of the authenticated account</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "roles",
            "description": "<p>Roles granted to the authenticated account</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error status 401": [
          {
            "group": "Error status 401",
            "type": "Number",
            "optional": false,
            "field": "error",
            "description": "<p>Error number code</p> <p><code>1000</code> The access token isn't valid</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routers/v1/accounts.router.ts",
    "groupTitle": "Accounts"
  }
] });
