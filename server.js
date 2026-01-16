import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
const upload = multer();

const AUTENTIQUE_URL = "https://api.autentique.com.br/v2/graphql";

/**
 * Health check
 */
app.get("/", (_, res) => {
  res.send("Autentique Bridge OK");
});

/**
 * Endpoint principal
 */
app.post("/autentique", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    // Campos (multipart/form-data)
    const { name, email, signerName } = req.body || {};

    // folderId pode vir em vários formatos (Fiqon varia bastante)
    const folderId =
      (req.body && (req.body.folderId || req.body.folder_id || req.body.folder)) ||
      req.headers["x-folder-id"];

    // =======================
    // Validações
    // =======================
    if (!file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email do signatário não informado" });
    }

    if (!folderId) {
      return res.status(400).json({
        error: "ID da pasta não informado",
        hint: "Envie folderId (ou folder_id) como campo de texto no multipart/form-data, junto com o arquivo.",
        received_body_keys: Object.keys(req.body || {}),
        received_headers_hint: {
          "x-folder-id": req.headers["x-folder-id"] ? "presente" : "ausente"
        }
      });
    }

    const finalSignerName = signerName || name || "Assinante";

    // =======================
    // 1) CREATE DOCUMENT
    // =======================
    const createOperations = {
      query: `
        mutation CreateDocument(
          $document: DocumentInput!
          $signers: [SignerInput!]!
          $file: Upload!
        ) {
          createDocument(
            document: $document
            signers: $signers
            file: $file
          ) {
            id
            name
          }
        }
      `,
      variables: {
        document: {
          name: name || "Documento via Render"
        },
        signers: [
          {
            name: finalSignerName,
            email: email,
            action: "SIGN"
          }
        ]
      }
    };

    const formData = new FormData();
    formData.append("operations", JSON.stringify(createOperations));
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", file.buffer, file.originalname);

    const createResponse = await fetch(AUTENTIQUE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AUTENTIQUE_TOKEN}`
      },
      body: formData
    });

    const createResult = await createResponse.json();

    if (createResult.errors) {
      return res.status(400).json({
        error: "Erro ao criar documento na Autentique",
        details: createResult.errors
      });
    }

    const documentId = createResult.data?.createDocument?.id;
    const documentName = createResult.data?.createDocument?.name;

    if (!documentId) {
      return res.status(500).json({
        error: "ID do documento não retornado pela Autentique",
        raw: createResult
      });
    }

    // =======================
    // 2) MOVE DOCUMENT TO FOLDER (Boolean)
    // =======================
    const movePayload = {
      query: `
        mutation MoveDocumentToFolder(
          $document_id: UUID!
          $folder_id: UUID!
        ) {
          moveDocumentToFolder(
            document_id: $document_id
            folder_id: $folder_id
          )
        }
      `,
      variables: {
        document_id: documentId,
        folder_id: String(folderId).trim()
      }
    };

    const moveResponse = await fetch(AUTENTIQUE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTENTIQUE_TOKEN}`
      },
      body: JSON.stringify(movePayload)
    });

    const moveResult = await moveResponse.json();

    if (moveResult.errors) {
      return res.status(400).json({
        error: "Documento criado, mas falhou ao mover para a pasta",
        documentId,
        folderId: String(folderId).trim(),
        details: moveResult.errors
      });
    }

    if (moveResult.data?.moveDocumentToFolder !== true) {
      return res.status(500).json({
        error: "Movimentação do documento não confirmada",
        documentId,
        folderId: String(folderId).trim(),
        raw: moveResult
      });
    }

    // =======================
    // Resposta final
    // =======================
    return res.json({
      status: "OK",
      document: {
        id: documentId,
        name: documentName,
        folder_id: String(folderId).trim()
      }
    });
  } catch (err) {
    console.error("Erro inesperado:", err);
    return res.status(500).json({
      error: "Erro interno no Autentique Bridge",
      message: err.message
    });
  }
});

/**
 * Start server
 */
app.listen(process.env.PORT || 3000, () => {
  console.log("Autentique Bridge rodando");
});
