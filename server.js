import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
const upload = multer();

const AUTENTIQUE_URL = "https://api.autentique.com.br/v2/graphql";
const FOLDER_ID = "945692871074d179b88e7400617e8ab5327f19d6";

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
    const { name, email, signerName } = req.body;
    const file = req.file;

    // =======================
    // Validações
    // =======================
    if (!file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email do signatário não informado" });
    }

    const finalSignerName = signerName || name || "Assinante";

    // =======================
    // 1️⃣ CREATE DOCUMENT
    // =======================
    const operations = {
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
    formData.append("operations", JSON.stringify(operations));
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
        error: "Erro ao criar documento",
        details: createResult.errors
      });
    }

    const documentId = createResult.data?.createDocument?.id;

    if (!documentId) {
      return res.status(500).json({
        error: "ID do documento não retornado",
        raw: createResult
      });
    }

    // =======================
    // 2️⃣ MOVE DOCUMENT TO FOLDER
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
          ) {
            id
          }
        }
      `,
      variables: {
        document_id: documentId,
        folder_id: FOLDER_ID
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
        error: "Documento criado, mas falhou ao mover para pasta",
        documentId,
        details: moveResult.errors
      });
    }

    // =======================
    // 🎯 Sucesso total
    // =======================
    return res.json({
      status: "OK",
      document: {
        id: documentId,
        name: createResult.data.createDocument.name,
        folder_id: FOLDER_ID
      }
    });

  } catch (err) {
    console.error("🔥 Erro inesperado:", err);
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
  console.log("🚀 Autentique Bridge rodando");
});
