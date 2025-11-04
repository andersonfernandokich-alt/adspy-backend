import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;

app.get("/api/search", async (req, res) => {
  const { q, country = "BR" } = req.query;

  try {
    const response = await axios.get("https://graph.facebook.com/v19.0/ads_archive", {
      params: {
        access_token: process.env.ACCESS_TOKEN,
        ad_type: "POLITICAL_AND_ISSUE_ADS",
        search_terms: q,
        ad_reached_countries: [country],
        fields: "ad_creation_time,ad_creative_body,ad_snapshot_url,page_name"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erro:", error.message);
    res.status(500).json({ error: "Erro ao buscar anúncios" });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
