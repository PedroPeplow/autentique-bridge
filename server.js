import express from "express";
import multer from "multer";
import FormData from "form-data";

const app = express();
const upload = multer();

// Middleware básico
app.use(express.json());

// Health check (boa prática no Render)
app.get("/", (req, res) => {
  res.json({ status: "Autentique bridge online" });
});

app.post("/autentique", upload.single("file"), async (req, res) => {
  try {
    console.log("📥 Nova requisição /autentique");

    // ===== Validações iniciais =====
    if (!process.env.AUTENTIQUE_API_KEY) {
      throw new Error("ENV AUTENTIQUE_API_KEY não definida");
    }

    const { name, email, groupId } = req.body;
    const file = req.file;

    console.log("Body recebido:", { name, email, groupId });
    console.log("Arquivo recebido:", file?.originalname);

    if (!file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email do signatário não informado" });
    }

    if (!groupId) {
      return res.status(400).json({ error: "groupId não informado" });
    }

    // ===== Montagem da mutation =====
    const operations = {
      query: `
        mutation CreateDocument(
          $document: DocumentInput!
          $file: Upload!
        ) {
          createDocument(
            document: $document,
            file: $file
          ) {
            id
            name
          }
        }
      `,
      variables: {
        document: {
          name: name || "Documento via Fiqon",
          groupId: groupId,
          signers: [
            {
              email: email,
              action: "SIGN"
            }
          ]
        }
      }
    };

    console.log("📤 Operations GraphQL:", JSON.stringify(operations, null, 2));

    // ===== Multipart GraphQL (padrão oficial) =====
    const formData = new FormData();
    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });

    // ===== Chamada ao Autentique =====
    const response = await fetch("https://api.autentique.com.br/v2/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AUTENTIQUE_API_KEY}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const rawText = await response.text();

    console.log("📡 Status Autentique:", response.status);
    console.log("📡 Resposta Autentique RAW:", rawText);

    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseErr) {
      throw new Error("Resposta do Autentique não é JSON válido");
    }

    if (result.errors) {
      console.error("❌ Erros GraphQL:", result.errors);
      return res.status(400).json(result);
    }

    console.log("✅ Documento criado:", result.data.createDocument);

    // ===== Resposta final =====
    res.json(result.data.createDocument);

  } catch (err) {
    console.error("🔥 ERRO NO /autentique");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});

// Porta padrão Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Autentique bridge rodando na porta ${PORT}`);
});
