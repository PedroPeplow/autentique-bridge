{
  "name": "Enviar para assinatura automaticamente",
  "nodes": [
    {
      "parameters": {},
      "id": "3fbf4d0a-b1bc-4117-a470-ede7c985fabb",
      "name": "Limit",
      "type": "n8n-nodes-base.limit",
      "typeVersion": 1,
      "position": [
        -900,
        340
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "6b8dcd0e-bd56-4924-8376-87f09a63e180",
              "name": "URL Info Doc",
              "value": "",
              "type": "string"
            },
            {
              "id": "dbe2ebe1-cdc4-4abd-af3b-ab04b38976c3",
              "name": "URL Info Usuarios",
              "value": "",
              "type": "string"
            },
            {
              "id": "7b462de8-8ece-48e2-97da-d996ed681c10",
              "name": "token",
              "value": "",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "adfc161c-d7a6-47fd-891b-361860efb048",
      "name": "Info Inicial (URL)",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -1500,
        340
      ]
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "={{ $json['URL Info Doc'] }}",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "={{ $json['URL Info Doc'] }}",
          "mode": "url"
        },
        "options": {}
      },
      "id": "00aa495f-9256-4390-8910-24cb90c49b21",
      "name": "Dados Doc",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        -1300,
        340
      ],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "2",
          "name": "icaro@metaalvo.com"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "loose",
            "version": 2
          },
          "conditions": [
            {
              "id": "0522a61b-adf3-494c-8934-62cf8ca9acc3",
              "leftValue": "={{ $json['Id Doc'].toString() }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "notEmpty",
                "singleValue": true
              }
            },
            {
              "id": "4fffd491-4688-4ea6-9d34-0b9853f467a0",
              "leftValue": "={{ $json['Nome Doc'] }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "notEmpty",
                "singleValue": true
              }
            },
            {
              "id": "82905929-bc83-47c1-a70a-e399f06643a7",
              "leftValue": "={{ $json.STATUS }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "empty",
                "singleValue": true
              }
            },
            {
              "id": "619e400f-3e8f-4882-9a3f-f2081baac876",
              "leftValue": "={{ $json['Link Doc'] }}",
              "rightValue": "=",
              "operator": {
                "type": "string",
                "operation": "notEmpty",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "looseTypeValidation": true,
        "options": {}
      },
      "id": "443ce7a9-40f7-499c-8ae5-b68247056a70",
      "name": "Filter Docs",
      "type": "n8n-nodes-base.filter",
      "typeVersion": 2.2,
      "position": [
        -1100,
        340
      ]
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "={{ $('Info Inicial (URL)').item.json['URL Info Usuarios'] }}",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "={{ $('Info Inicial (URL)').item.json['URL Info Usuarios'] }}",
          "mode": "url"
        },
        "options": {}
      },
      "id": "e3e2a440-b58f-459c-99eb-1c32811e1515",
      "name": "Dados Usuarios",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        -700,
        340
      ],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "2",
          "name": "icaro@metaalvo.com"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "loose",
            "version": 2
          },
          "conditions": [
            {
              "id": "8305d084-3a61-4f6d-bdeb-9a99636396d5",
              "leftValue": "={{ $json.Nome }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "notEmpty",
                "singleValue": true
              }
            },
            {
              "id": "b6ff48e1-838c-4c62-98c9-8caeafc7c7d8",
              "leftValue": "={{ $('Limit').item.json['Id Doc'] }}",
              "rightValue": "={{ $json['ID Doc'] }}",
              "operator": {
                "type": "number",
                "operation": "equals"
              }
            },
            {
              "id": "f325801e-811c-45d0-af0e-fe291c46d278",
              "leftValue": "={{ $json.Satus }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "empty",
                "singleValue": true
              }
            },
            {
              "id": "d631cb32-bbda-450e-9bd1-2e1c6e54f007",
              "leftValue": "={{ $json['Id Usuario'].toString() }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "notEmpty",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "looseTypeValidation": true,
        "options": {}
      },
      "id": "9c904199-2fbd-4073-a2f1-957595f451df",
      "name": "Filter Usuarios",
      "type": "n8n-nodes-base.filter",
      "typeVersion": 2.2,
      "position": [
        -500,
        340
      ]
    },
    {
      "parameters": {
        "aggregate": "aggregateAllItemData",
        "options": {}
      },
      "id": "be452614-513d-4464-baf3-1c9c2a8ed4e3",
      "name": "Aggregate All",
      "type": "n8n-nodes-base.aggregate",
      "typeVersion": 1,
      "position": [
        -300,
        340
      ]
    },
    {
      "parameters": {
        "jsCode": "const inputData = $json.data;\n\nconst signers = inputData.map(item => {\n  return {\n    name: item.Nome,\n    email: item.Email,\n    action: \"SIGN\"\n  };\n});\n\nreturn [{ json: { signers } }];"
      },
      "id": "e7d815ca-683c-44bb-ad7c-f4f3d6d361b2",
      "name": "Map Info Usuarios",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -100,
        340
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "c5d42820-f529-4bfe-b0a7-f5bc1b5c57a5",
              "name": "Nome do Documento",
              "value": "={{ $('Limit').item.json['Nome Doc'] }}",
              "type": "string"
            },
            {
              "id": "2bb2efc4-7ec4-47f8-a9a6-d3fefd4f06b4",
              "name": "Mensagem Quando Enviado",
              "value": "={{ $('Limit').item.json['Mensagem Quando Enviado'] }}",
              "type": "string"
            },
            {
              "id": "8aef3a6a-0fa4-425a-a2c6-6fadd783f24d",
              "name": "Assinatura em Ordem",
              "value": "={{ $('Limit').item.json['Assinatura em Ordem'] }}",
              "type": "boolean"
            },
            {
              "id": "778e0840-bb42-4871-bb3f-451621b5b12b",
              "name": "Permitir Recusa Documento",
              "value": "={{ $('Limit').item.json['Permitir Recusa Documento'] }}",
              "type": "boolean"
            },
            {
              "id": "91196ce4-cccc-49d1-823a-86a7ad194204",
              "name": "Ler Todo Documento",
              "value": "={{ $('Limit').item.json['Ler Todo Documento'] }}",
              "type": "boolean"
            },
            {
              "id": "336fd57f-a788-4b11-afdf-18409892e60e",
              "name": "Vencimento Assinatura",
              "value": "={{ $('Limit').item.json['Vencimento Assinatura'] }}",
              "type": "string"
            },
            {
              "id": "48a1602d-a706-46dc-90f6-d324bb404bf9",
              "name": "Enviar Para Assinatura",
              "value": "={{ $('Limit').item.json['Enviar Para Assinatura'] }}",
              "type": "boolean"
            },
            {
              "id": "bd46c0df-84be-45af-ae4a-a55bb4f95709",
              "name": "Receber Notificação Quando Assinado",
              "value": "={{ $('Limit').item.json['Receber Notificação Quando Assinado'] }}",
              "type": "boolean"
            }
          ]
        },
        "options": {}
      },
      "id": "3a7d3909-92c5-4b6c-a3cc-5ce9c0ad3d9d",
      "name": "Map Info Doc",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        100,
        340
      ]
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": {
          "__rl": true,
          "value": "={{ $('Limit').item.json['Link Doc'] }}",
          "mode": "url"
        },
        "options": {}
      },
      "id": "d23de4fc-997b-42a0-bb92-a9c377e68350",
      "name": "Donwload Doc (PDF)",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        320,
        340
      ],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "SxPhBtWZnH05bC3W",
          "name": "Icaro@metaalvo.com"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.autentique.com.br/v2/graphql",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "=Bearer {{ $('Info Inicial (URL)').item.json.token }}"
            }
          ]
        },
        "sendBody": true,
        "contentType": "multipart-form-data",
        "bodyParameters": {
          "parameters": [
            {
              "name": "operations",
              "value": "={\n  \"query\": \"mutation CreateDocumentMutation($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) { createDocument(document: $document, signers: $signers, file: $file) { id name refusable sortable created_at signatures { public_id name email created_at action { name } link { short_link } user { id name email } } } }\",\n  \"variables\": {\n    \"document\": {\n      \"name\": \"{{ $('Map Info Doc').item.json['Nome do Documento'] }}\",\n      \"message\": \"{{ $('Map Info Doc').item.json['Mensagem Quando Enviado'] }}\",\n      \"reminder\": \"DAILY\",\n      \"sortable\": {{ $('Map Info Doc').item.json['Assinatura em Ordem'] }},\n      \"refusable\": {{ $('Map Info Doc').item.json['Permitir Recusa Documento'] }},\n      \"footer\": \"LEFT\",\n      \"deadline_at\": \"{{ $('Limit').item.json['Vencimento Assinatura'].isNotEmpty() == false ? \"\" : new Date($('Limit').item.json['Vencimento Assinatura']).toISOString() }}\",\n      \"new_signature_style\": true,\n      \"ignore_cpf\": false,\n      \"configs\": {\n        \"notification_finished\": {{ $('Map Info Doc').item.json['Enviar Para Assinatura'] }},\n        \"notification_signed\": {{ $('Map Info Doc').item.json['Receber Notificação Quando Assinado'] }}\n      },\n      \"locale\": {\n        \"language\": \"pt-BR\",\n        \"country\": \"BR\",\n        \"timezone\": \"America/Sao_Paulo\",\n        \"date_format\": \"DD_MM_YYYY\"\n      }\n    },\n    \"signers\": {{ $('Map Info Usuarios').item.json.signers.toJsonString() }}\n  }\n}\n"
            },
            {
              "name": "map",
              "value": "={\n  \"file\": [\"variables.file\"]\n}"
            },
            {
              "parameterType": "formBinaryData",
              "name": "file",
              "inputDataFieldName": "data"
            }
          ]
        },
        "options": {}
      },
      "id": "d6ec3e50-122a-42cd-ad53-efd2337c6c30",
      "name": "Criar Doc (Autentique)",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        520,
        340
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.autentique.com.br/v2/graphql",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer ed6b838c8ee1ec44124b6d0fd1d8a095ffc2b8452292a809a8122cd8bbf79a4f"
            }
          ]
        },
        "sendBody": true,
        "contentType": "multipart-form-data",
        "bodyParameters": {
          "parameters": [
            {
              "name": "operations",
              "value": "={\n  \"query\": \"mutation CreateDocumentMutation($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) { createDocument(document: $document, signers: $signers, file: $file) { id name refusable sortable created_at signatures { public_id name email created_at action { name } link { short_link } user { id name email } } } }\",\n  \"variables\": {\n    \"document\": {\n      \"name\": \"Contrato empresa XPTO2\",\n      \"message\": \"Segue o Documento Para Assinatura.\",\n      \"reminder\": \"DAILY\",\n      \"sortable\": false,\n      \"refusable\": false,\n      \"footer\": \"LEFT\",\n      \"deadline_at\": \"2024-12-20T00:00:00.000Z\",\n      \"new_signature_style\": true,\n      \"ignore_cpf\": false,\n      \"configs\": {\n        \"notification_finished\": true,\n        \"notification_signed\": true\n      },\n      \"locale\": {\n        \"language\": \"pt-BR\",\n        \"country\": \"BR\",\n        \"timezone\": \"America/Sao_Paulo\",\n        \"date_format\": \"DD_MM_YYYY\"\n      }\n    },\n    \"signers\": [\n      {\n        \"name\": \"Icaro da Hora\",\n        \"email\": \"icaro@metaalvo.com\",\n        \"action\": \"SIGN\",\n        \"security_verifications\": [\n          { \"type\": \"MANUAL\" }\n        ]\n      },\n      {\n        \"name\": \"Adrielli Gomes\",\n        \"email\": \"adrielli@metaalvo.com\",\n        \"action\": \"SIGN\",\n        \"security_verifications\": [\n          { \"type\": \"MANUAL\" }\n        ]\n      }\n    ]\n  }\n}\n"
            },
            {
              "name": "map",
              "value": "={\n  \"file\": [\"variables.file\"]\n}"
            },
            {
              "parameterType": "formBinaryData",
              "name": "file",
              "inputDataFieldName": "data"
            }
          ]
        },
        "options": {}
      },
      "id": "bd72e758-62fa-4e6f-85e7-b08138dd44fd",
      "name": "Criar Doc (Autentique)1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -1480,
        1440
      ]
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": {
          "__rl": true,
          "value": "=https://drive.google.com/file/d/1QObZC7Huq2yugA4NIaFyjnfXK4xQa-9j/view?usp=sharing",
          "mode": "url"
        },
        "options": {}
      },
      "id": "02a9f5d0-89e1-4513-a879-4bc4f1df53fc",
      "name": "Donwload Doc (PDF)1",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        -1700,
        1440
      ],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "SxPhBtWZnH05bC3W",
          "name": "Icaro@metaalvo.com"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "documentId": {
          "__rl": true,
          "value": "={{ $('Info Inicial (URL)').item.json['URL Info Doc'] }}",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "={{ $('Info Inicial (URL)').item.json['URL Info Doc'] }}",
          "mode": "url"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "row_number": "={{ $('Limit').item.json.row_number }}",
            "STATUS": "CONCLUÍDO"
          },
          "matchingColumns": [
            "row_number"
          ],
          "schema": [
            {
              "id": "Id Doc",
              "displayName": "Id Doc",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Nome Doc",
              "displayName": "Nome Doc",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Mensagem Quando Enviado",
              "displayName": "Mensagem Quando Enviado",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Assinatura em Ordem",
              "displayName": "Assinatura em Ordem",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Permitir Recusa Documento",
              "displayName": "Permitir Recusa Documento",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Ler Todo Documento",
              "displayName": "Ler Todo Documento",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Vencimento Assinatura",
              "displayName": "Vencimento Assinatura",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Enviar Para Assinatura",
              "displayName": "Enviar Para Assinatura",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Receber Notificação Quando Assinado",
              "displayName": "Receber Notificação Quando Assinado",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "STATUS",
              "displayName": "STATUS",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Link Doc",
              "displayName": "Link Doc",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "row_number",
              "displayName": "row_number",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "readOnly": true,
              "removed": false
            }
          ]
        },
        "options": {}
      },
      "id": "03978061-91c7-4f55-9dfb-719eb38c657a",
      "name": "UPDATE STATUS DOC",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        800,
        440
      ],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "2",
          "name": "icaro@metaalvo.com"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "documentId": {
          "__rl": true,
          "value": "={{ $('Info Inicial (URL)').item.json['URL Info Usuarios'] }}",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "={{ $('Info Inicial (URL)').item.json['URL Info Usuarios'] }}",
          "mode": "url"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "row_number": "={{ $json.row_number }}",
            "Satus": "CONCLUÍDO"
          },
          "matchingColumns": [
            "row_number"
          ],
          "schema": [
            {
              "id": "Id Usuario",
              "displayName": "Id Usuario",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Nome",
              "displayName": "Nome",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Email",
              "displayName": "Email",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "ID Doc",
              "displayName": "ID Doc",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Satus",
              "displayName": "Satus",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "row_number",
              "displayName": "row_number",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "readOnly": true,
              "removed": false
            }
          ]
        },
        "options": {}
      },
      "id": "418c145e-95be-4716-b1f5-11cfeb5629ea",
      "name": "UPDATE STATUS USUARIOS",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.5,
      "position": [
        1240,
        260
      ],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "2",
          "name": "icaro@metaalvo.com"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "32b47cce-a4c6-41fc-bfb3-57537252b544",
              "name": "data",
              "value": "={{ $('Aggregate All').item.json.data }}",
              "type": "array"
            }
          ]
        },
        "options": {}
      },
      "id": "909cbde7-75f5-4eff-9e11-fadab4629b9e",
      "name": "Edit Fields",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        800,
        260
      ]
    },
    {
      "parameters": {
        "fieldToSplitOut": "data",
        "options": {}
      },
      "id": "aa19eddb-802d-45a6-bf2a-1f4d634743d6",
      "name": "Split Out",
      "type": "n8n-nodes-base.splitOut",
      "typeVersion": 1,
      "position": [
        1020,
        260
      ]
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "minutes"
            }
          ]
        }
      },
      "id": "6743f30d-95e1-416d-92d4-8bd39c3f0f22",
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [
        -1720,
        340
      ]
    }
  ],
  "pinData": {},
  "connections": {
    "Limit": {
      "main": [
        [
          {
            "node": "Dados Usuarios",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Info Inicial (URL)": {
      "main": [
        [
          {
            "node": "Dados Doc",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Dados Doc": {
      "main": [
        [
          {
            "node": "Filter Docs",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Docs": {
      "main": [
        [
          {
            "node": "Limit",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Dados Usuarios": {
      "main": [
        [
          {
            "node": "Filter Usuarios",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Usuarios": {
      "main": [
        [
          {
            "node": "Aggregate All",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Aggregate All": {
      "main": [
        [
          {
            "node": "Map Info Usuarios",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Map Info Usuarios": {
      "main": [
        [
          {
            "node": "Map Info Doc",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Map Info Doc": {
      "main": [
        [
          {
            "node": "Donwload Doc (PDF)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Donwload Doc (PDF)": {
      "main": [
        [
          {
            "node": "Criar Doc (Autentique)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Donwload Doc (PDF)1": {
      "main": [
        [
          {
            "node": "Criar Doc (Autentique)1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Criar Doc (Autentique)": {
      "main": [
        [
          {
            "node": "UPDATE STATUS DOC",
            "type": "main",
            "index": 0
          },
          {
            "node": "Edit Fields",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields": {
      "main": [
        [
          {
            "node": "Split Out",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split Out": {
      "main": [
        [
          {
            "node": "UPDATE STATUS USUARIOS",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Info Inicial (URL)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "63e75497-d56f-42cc-b81a-6e5b0096fc75",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "3fc9dfb55366e7c68256d6183745557a0c582fd41c2acf6f3a2a91d13e79e36a"
  },
  "id": "9e5sz0vgntcY12Oj",
  "tags": []
}
