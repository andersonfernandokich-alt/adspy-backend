import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;

// ✅ Rota para testar conexão
app.get("/", (req, res) => {
  res.json({ message: "Conexão com Facebook OK ✅" });
});

// ✅ Rota para buscar anúncios da Meta Ads Library
app.get("/api/search", async (req, res) => {
  const { q, country = "BR" } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Informe um termo de busca com ?q=" });
  }

  try {
    const response = await axios.get("https://graph.facebook.com/v19.0/ads_archive", {
      params: {
        access_token: process.env.ACCESS_TOKEN,
        ad_reached_countries: [country],
        search_terms: q,
        fields: "ad_creation_time,ad_creative_body,ad_creative_link_caption,ad_creative_link_title,ad_snapshot_url,page_name,page_id",
      },
    });

    res.json({
      total: response.data.data.length,
      results: response.data.data,
    });
  } catch (error) {
    console.error("Erro ao buscar anúncios:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao buscar anúncios na API da Meta" });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
