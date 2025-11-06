import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.get("/", (req, res) => {
  res.json({ message: "Conexão com Facebook OK ✅", user: { name: "Anderson Kich" } });
});

app.get("/api/anuncios", async (req, res) => {
  const q = req.query.q || "";

  if (!ACCESS_TOKEN) {
    return res.status(500).json({ error: "ACCESS_TOKEN não definido no .env" });
  }

  try {
    const response = await axios.get("https://graph.facebook.com/v19.0/ads_archive", {
      params: {
        access_token: ACCESS_TOKEN,
        ad_reached_countries: ["BR"],
        search_terms: q,
        fields:
          "id,ad_creation_time,ad_creative_bodies,ad_snapshot_url,ad_creative_link_caption,ad_creative_link_description,page_name,page_id",
      },
    });

    if (!response.data.data || response.data.data.length === 0) {
      return res.status(404).json({ message: "Nenhum anúncio encontrado." });
    }

    res.json(response.data.data);
  } catch (error) {
    console.error("Erro ao buscar anúncios:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error || { message: "Erro desconhecido ao buscar anúncios." },
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
