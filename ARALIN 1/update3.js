const fs = require('fs');
let css = fs.readFileSync('src/css/style.css', 'utf-8');

const regexHomeBtn = /\.home-btn \{[\s\S]*?box-shadow: 0 4px 12px rgba\(0, 0, 0, \);\n\}/;
css = css.replace(regexHomeBtn, 
.home-btn {
  pointer-events: auto;
  position: static;
  width: 56px; height: 56px;
  border-radius: 50%;
  background: #0A84FF;
  border: 4px solid #1C1C1E;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 20px rgba(10, 132, 255, 0.4);
  margin: -24px 10px 0;
});

const regexHover = /\.home-btn:hover \{[\s\S]*?\}/;
css = css.replace(regexHover, '.home-btn:hover { background: #005BB5; transform: scale(1.05) translateY(-4px); box-shadow: 0 8px 25px rgba(10, 132, 255, 0.5); }');

const regexActive = /\.home-btn:active \{[\s\S]*?\}/;
css = css.replace(regexActive, '.home-btn:active { transform: scale(0.95); }');

css = css.replace('.nav-arrow-btn {\n  pointer-events: auto;\n  width: 56px; height: 56px;', 
.nav-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 0;
}
.nav-arrow-btn {
  pointer-events: auto;
  width: auto; height: auto;
  min-width: 60px;
  flex-direction: column; gap: 4px;);

fs.writeFileSync('src/css/style.css', css, 'utf-8');
console.log('Script done!');
