import app from "./app";
console.log("🔥 LOGIN START");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 FitPro API rodando na porta ${PORT}`);
});