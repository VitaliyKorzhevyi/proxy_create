import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"; // стили ниже

export default function ProxyGenerator() {
  const [template, setTemplate] = useState("");
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(100);
  const [theme, setTheme] = useState("light");

  // применяем тему к body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const generateProxies = () => {
    const regex = /(sessionid-)([^-\s]+)/i;

    if (!regex.test(template)) {
      toast.error('❌ В шаблоне не найден "sessionid-..."');
      return;
    }

    const list = [];
    for (let i = start; i <= end; i++) {
      list.push(template.replace(regex, `$1${i}`));
    }

    const output = list.join("\n");

    // Скачивание .txt
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proxies.txt";
    a.click();
    URL.revokeObjectURL(url);

    // Копирование
    navigator.clipboard.writeText(output);
    toast.success("Список скопирован и скачан ✅");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Session Generator</h1>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        <textarea
          className="input"
          placeholder="Вставь шаблон прокси..."
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        />

        <div className="range">
          <div>
            <label>От:</label>
            <input
            className="werty"
              type="number"
              value={start}
              onChange={(e) => setStart(Number(e.target.value))}
            />
          </div>
          <div>
            <label>До:</label>
            <input
            className="werty"
              type="number"
              value={end}
              onChange={(e) => setEnd(Number(e.target.value))}
            />
          </div>
        </div>

        <button className="start-btn" onClick={generateProxies}>
          🚀 Start
        </button>

        <p className="hint">
          После нажатия список скачается и скопируется в буфер обмена.
        </p>
      </div>

      <ToastContainer position="top-right" theme={theme} />
    </div>
  );
}