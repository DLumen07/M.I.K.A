const fs = require('fs');
let css = fs.readFileSync('src/css/style.css', 'utf-8');

css = css.replace('.view-drag-drop {\n  width: 100%; height: 100%; display: flex;\n  flex-direction: column; align-items: center; justify-content: flex-start;\n  padding: 0;', '.view-drag-drop {\n  width: 100%; height: 100%; display: flex;\n  flex-direction: column; align-items: center; justify-content: flex-start;\n  padding: 0 0 160px 0;');

css = css.replace(/.dd-words-header \{[\s\S]*?animation: popDownHeader[^}]*\}/, 
\.dd-words-header {
  position: sticky;
  top: 20px;
  z-index: 150;
  width: 90%;
  max-width: 600px;
  margin: 20px auto;
  background: rgba(30, 30, 32, 0.75);
  backdrop-filter: blur(25px) saturate(2);
  -webkit-backdrop-filter: blur(25px) saturate(2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  padding: 8px;
  animation: popDownHeader 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}\);

css = css.replace('.dd-text-only .dd-words {\n  border-radius: 12px;\n  border-top: 2px solid rgba(255, 255, 255, 0.1);\n}', '.dd-text-only .dd-words {\n  border-radius: 12px;\n}');

css = css.replace(/.dd-check-btn \{[\s\S]*?border-bottom: 2px solid #f57f17;[\s\S]*?\}/, 
\.dd-check-btn {
  padding: 12px 36px; border-radius: 20px;
  background: linear-gradient(135deg, #0A84FF, #005BB5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF; font-size: 16px; font-weight: 800; letter-spacing: 1px;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-family: inherit; box-shadow: 0 6px 16px rgba(10, 132, 255, 0.3), inset 0 2px 4px rgba(255,255,255,0.2);
}\);

css = css.replace('.dd-check-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 0 #f57f17, 0 8px 15px rgba(0,0,0,0.3); }', '.dd-check-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 24px rgba(10, 132, 255, 0.5), inset 0 2px 4px rgba(255,255,255,0.3); }');
css = css.replace('.dd-check-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #f57f17; border-bottom-width: 0; }', '.dd-check-btn:active { transform: translateY(2px) scale(0.98); box-shadow: 0 2px 8px rgba(10, 132, 255, 0.4); }');

css = css.replace(/.dd-reset-btn \{[\s\S]*?border-bottom: none; transform: none;[\s\S]*?\}/, 
\.dd-reset-btn {
  padding: 12px 36px; border-radius: 20px;
  background: linear-gradient(135deg, #FF453A, #D70015);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF; font-size: 16px; font-weight: 800; letter-spacing: 1px;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-family: inherit; box-shadow: 0 6px 16px rgba(255, 69, 58, 0.3), inset 0 2px 4px rgba(255,255,255,0.2);
}\);

css = css.replace('.dd-reset-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 0 #b71c1c, 0 8px 15px rgba(0,0,0,0.3); }', '.dd-reset-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 24px rgba(255, 69, 58, 0.5), inset 0 2px 4px rgba(255,255,255,0.3); }');
css = css.replace('.dd-reset-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #b71c1c; border-bottom-width: 0; }', '.dd-reset-btn:active { transform: translateY(2px) scale(0.98); box-shadow: 0 2px 8px rgba(255, 69, 58, 0.4); }');

/* Refactor nav-arrows background */
css = css.replace('.nav-arrows {\n    background: rgba(28, 28, 30, 0.95);\n    backdrop-filter: blur(20px) saturate(1.5);\n    -webkit-backdrop-filter: blur(20px) saturate(1.5);\n    bottom: 0;\n    padding: 6px 20px;\n    padding-bottom: max(6px, env(safe-area-inset-bottom));\n    align-items: center;\n    justify-content: space-around;\n    pointer-events: auto;\n    border-top: 1px solid rgba(255, 255, 255, 0.1);\n    border-radius: 20px 20px 0 0;', 
\.nav-arrows {
    background: rgba(30, 30, 32, 0.85);
    backdrop-filter: blur(25px) saturate(2);
    -webkit-backdrop-filter: blur(25px) saturate(2);
    bottom: 12px;
    left: 12px; right: 12px;
    padding: 8px 20px;
    padding-bottom: max(8px, env(safe-area-inset-bottom));
    align-items: center;
    justify-content: space-around;
    pointer-events: auto;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 30px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.05);\);

fs.writeFileSync('src/css/style.css', css, 'utf-8');
console.log('Script updated!');
