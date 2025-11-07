import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;

// ✅ Rota de teste pra ver se o token do APP tá funcionando
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://graph.facebook.com/v19.0/app",
      {
        params: {
          access_token: process.env.ACCESS_TOKEN,
        },
      }
    );
    res.json({
      message: "Conexão com Facebook OK ✅ (Token de Aplicativo)",
      app: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao conectar com o Facebook ❌",
      error: error.response?.data || error.message,
    });
  }
});

// 🔍 Rota pra buscar anúncios
app.get("/api/anuncios", async (req, res) => {
  const { q, country = "BR" } = req.query;

  try {
    const response = await axios.get(
      "https://graph.facebook.com/v19.0/ads_archive",
      {
        params: {
          access_token: process.env.ACCESS_TOKEN,
          search_terms: q,
          ad_reached_countries: [country],
          ad_type: "ALL",
          fields:
            "ad_creation_time,ad_creative_body,ad_snapshot_url,page_name",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erro:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || "Erro desconhecido ao buscar anúncios",
    });
  }
});

app.listen(PORT, () =>
  console.log(`Servidor rodando na porta ${PORT}`)
);
