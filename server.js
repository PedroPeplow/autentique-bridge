const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const upload = multer();

app.post("/autentique", upload.single("file"), async (req, res) => {
  try {
    const { email, documentName } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Arquivo PDF não enviado" });
    }

    const form = new FormData();

    form.append(
      "operations",
      JSON.stringify({
        query: `
          mutation CreateDocument(
            $document: DocumentInput!,
            $signers: [SignerInput!]!,
            $file: Upload!
          ) {
            createDocument(
              document: $document,
              signers: $signers,
              file: $file
            ) {
              id
              name
            }
          }
        `,
        variables: {
          file: null,
          signers: [
            {
              email: email,
              action: "SIGN"
            }
          ],
          document: {
            name: documentName
          }
        }
      })
    );

    form.append("map", JSON.stringify({ "0": ["variables.file"] }));
    form.append("0", req.file.buffer, {
      filename: req.file.originalname,
      contentType: "application/pdf"
    });

    const response = await axios.post(
      "https://api.autentique.com.br/v2/graphql",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.AUTENTIQUE_API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: error.message });
  }
});

app.get("/", (_, res) => {
  res.send("Autentique bridge online 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta", PORT));
