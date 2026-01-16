import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
const upload = multer();

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

    const finalSignerName =
      signerName ||
      name ||
      "Assinante";

    // =======================
    // GraphQL (Autentique)
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
          ) TransferDocument($document_id: ID!, $group_id: ID!) {
      transferDocument(
        document_id: $document_id
        group_id: $group_id
      ){
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

    // =======================
    // Multipart GraphQL Upload
    // =======================
    const formData = new FormData();
    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", file.buffer, file.originalname);

    // =======================
    // Chamada à Autentique
    // =======================
    const response = await fetch("https://api.autentique.com.br/v2/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AUTENTIQUE_TOKEN}`
      },
      body: formData
    });

    const result = await response.json();

    // =======================
    // Tratamento de erros
    // =======================
    if (result.errors) {
      console.error("❌ Erros Autentique:", JSON.stringify(result.errors));
      return res.status(400).json({
        error: "Erro ao criar documento na Autentique",
        details: result.errors
      });
    }

    if (!result.data || !result.data.createDocument) {
      console.error("❌ Resposta inválida Autentique:", JSON.stringify(result));
      return res.status(500).json({
        error: "Resposta inválida da Autentique",
        raw: result
      });
    }

    // =======================
    // Sucesso
    // =======================
    return res.json(result.data.createDocument);

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
