import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
const upload = multer();
app.use(express.json());

app.post("/autentique", upload.single("file"), async (req, res) => {
  try {
    const { name, email, groupId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    if (!groupId) {
      return res.status(400).json({ error: "groupId não informado" });
    }

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
          name: name || "Documento via FiqOn",
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

    const formData = new FormData();
    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", file.buffer, file.originalname);

    const response = await fetch("https://api.autentique.com.br/v2/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AUTENTIQUE_API_KEY}`
      },
      body: formData
    });

    const result = await response.json();

    if (result.errors) {
      return res.status(400).json(result);
    }

    res.json(result.data.createDocument);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Autentique bridge rodando");
});
