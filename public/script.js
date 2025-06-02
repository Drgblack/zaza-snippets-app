let lastPrompt = "";

const translations = {
  en: {
    generateBtn: "Generate Comment",
    regenerateBtn: "Regenerate",
    copyBtn: "Copy",
    languageLabel: "Language",
    generatedComment: "Generated Comment:",
    error: "Error generating comment.",
    presets: "Prompt presets (optional)",
  },
  it: {
    generateBtn: "Genera commento",
    regenerateBtn: "Rigenera",
    copyBtn: "Copia",
    languageLabel: "Lingua",
    generatedComment: "Commento generato:",
    error: "Errore durante la generazione del commento.",
    presets: "Prompt predefiniti (facoltativi)",
  },
  // Add other languages here...
};

function updateLanguage() {
  const lang = document.getElementById("language").value;
  const t = translations[lang];

  document.getElementById("generateBtn").innerText = t.generateBtn;
  document.getElementById("regenerateBtn").innerText = t.regenerateBtn;
  document.getElementById("copyBtn").innerText = t.copyBtn;
  document.getElementById("languageLabel").innerText = t.languageLabel;
  document.getElementById("presetsLabel").innerText = t.presets;
  document.getElementById("resultLabel").innerText = t.generatedComment;
}

async function generate() {
  const prompt = document.getElementById("prompt").value || document.getElementById("preset").value;
  const language = document.getElementById("language").value;
  lastPrompt = prompt;

  const fullPrompt = language === "en" ? prompt : `Translate this to ${language}: ${prompt}`;

  const res = await fetch("https://us-central1-zaza-snippet.cloudfunctions.net/generateSnippet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: fullPrompt })
  });

  const resultEl = document.getElementById("result");
  try {
    const data = await res.json();
    resultEl.innerText = data.result;
    addToHistory(data.result);
  } catch {
    resultEl.innerText = translations[language].error;
  }
}

function regenerate() {
  if (lastPrompt) {
    document.getElementById("prompt").value = lastPrompt;
    generate();
  }
}

function copyComment() {
  const text = document.getElementById("result").innerText;
  navigator.clipboard.writeText(text).then(() => alert("Copied!"));
}

function addToHistory(comment) {
  const ul = document.getElementById("history");
  const li = document.createElement("li");
  li.innerText = comment;
  ul.prepend(li);
  if (ul.children.length > 10) ul.removeChild(ul.lastChild);
}
