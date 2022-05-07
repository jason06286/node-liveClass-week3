const apiDoc = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0", //版本號
    title: "Posts API", //swagger文件的標頭
    description: "This is a posts API for CRUD.", //swagger描述
    contact: {
      name: "baseurl",
      url: "https://protected-refuge-81301.herokuapp.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local dev",
    },
    {
      url: "https://protected-refuge-81301.herokuapp.com",
      description: "Production dev",
    },
  ],

  tags: [
    {
      name: "Posts",
      description: "RESTful API for Post system",
    },
  ],
  consumes: ["application/json"],
  produces: ["application/json"],
  paths: {
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "Get all Posts",
        produces: ["application/json"],
        responses: {
          200: {
            //用statuCode做分類
            description: "OK",
            content: {
              //內容
              "application/json": {
                //response格式
                schema: {
                  //response要吃什麼樣的model
                  $ref: "#/definitions/Posts",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Create a new Post",
        requestBody: {
          description: "Post object",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: { type: "string" },
                  image: { type: "array", items: [] },
                  content: { type: "string" },
                },
              },
            },
          },
        },
        produces: ["application/json"],
        responses: {
          200: {
            //用statuCode做分類
            description: "回傳新增內容",
            content: {
              //內容
              "application/json": {
                //response格式
                schema: {
                  //response要吃什麼樣的model
                  $ref: "#/definitions/Posts",
                },
              },
            },
          },
          400: {
            //用statuCode做分類
            description: "回傳新增內容",
            content: {
              "application/json": {
                example: {
                  message: "必填欄位缺少哪些",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Delete all Posts",
        produces: ["application/json"],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: [],
                },
              },
            },
          },
        },
      },
    },
    "/posts/{id}": {
      patch: {
        tags: ["Posts"],
        summary: "Update Posts ",
        parameters: [
          //更新的參數要怎麼帶?
          {
            name: "id",
            in: "path",
            required: true,
            description: "Post id",
            example: "627680119cbd8f9936bedcb5",
          },
        ],
        requestBody: {
          description: "update Post ",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tags: {
                    type: "array",
                    items: [],
                  },
                  content: {
                    type: "string",
                  },
                  likes: {
                    type: "number",
                  },
                  comments: {
                    type: "number",
                  },
                  type: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: "所有貼文內容",
                },
              },
            },
          },
          400: {
            //用statuCode做分類
            description: "回傳新增內容",
            content: {
              "application/json": {
                example: {
                  message: "查無此ID || 請帶入正確ID",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Delete Posts",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Post id",
            example: "627680119cbd8f9936bedcb5",
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: "剩餘的貼文",
                },
              },
            },
          },
          400: {
            //用statuCode做分類
            description: "回傳新增內容",
            content: {
              "application/json": {
                example: {
                  message: "查無此ID || 請帶入正確ID",
                },
              },
            },
          },
        },
      },
    },
  },
  definitions: {
    Posts: {
      type: "object", //資料表物件
      properties: {
        //資料表屬性
        _id: {
          type: "string",
        },
        user: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            photo: { type: "string" },
          },
        },
        tags: {
          type: "array",
          items: [],
        },
        image: {
          type: "array",
          items: [],
        },
        content: {
          type: "string",
        },
        likes: {
          type: "number",
        },
        comments: {
          type: "number",
        },
        type: {
          type: "string",
        },
        createdAt: {
          type: "string",
        },
      },
    },
  },
};

module.exports = apiDoc;
