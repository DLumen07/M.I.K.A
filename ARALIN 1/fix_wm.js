const fs = require('fs');
let css = fs.readFileSync('src/css/style.css', 'utf8');

const regex = /\/\* \â\\ Word cards \(left, numbered\) \â\\ \*\/\s*solid rgba\(255, 255, 255, 0\.05\);[\s\S]*?\(255, 255, 255, 0\.03\);\s*\}/;

const altRegex = /\/\*.*?Word cards.*?left, numbered.*?\*\/[\s\S]*?\(255, 255, 255, 0\.03\);\s*\}/;

const replacement = \/* --- Word cards (left, numbered) --- */
.wm-word {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  font-weight: 600;
  color: #FFFFFF;
  position: relative;
  min-height: 44px;
}
.wm-word:hover { background: rgba(255, 255, 255, 0.05); }
.wm-word.wm-selected {
  background: #0A84FF;
  border-color: #005BB5;
}
.wm-word.wm-linked { background: rgba(255, 255, 255, 0.03); }
\;

css = css.replace(altRegex, replacement);
fs.writeFileSync('src/css/style.css', css, 'utf8');
console.log('Fixed wm-word using altRegex');
