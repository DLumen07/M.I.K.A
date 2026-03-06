const fs = require("fs");
let css = fs.readFileSync("src/css/style.css", "utf8");
const altRegex = /\/\*.*?Word cards.*?left, numbered.*?\*\/[\s\S]*?\(255, 255, 255, 0\.03\);\s*\}/;
const replacement = "/* --- Word cards (left, numbered) --- */\n.wm-word {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  background: transparent;\n  border: 1px solid transparent;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.05);\n  border-radius: 8px;\n  padding: 8px 10px;\n  cursor: pointer;\n  transition: all 0.2s;\n  font-size: 0.9rem;\n  font-weight: 600;\n  color: #FFFFFF;\n  position: relative;\n  min-height: 44px;\n}\n.wm-word:hover { background: rgba(255, 255, 255, 0.05); }\n.wm-word.wm-selected {\n  background: #0A84FF;\n  border-color: #005BB5;\n}\n.wm-word.wm-linked { background: rgba(255, 255, 255, 0.03); }";
css = css.replace(altRegex, replacement);
fs.writeFileSync("src/css/style.css", css, "utf8");
console.log("Fixed.");
