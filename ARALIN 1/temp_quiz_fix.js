const fs = require('fs');
let css = fs.readFileSync('src/css/style.css', 'utf8');

css = css.replace(/\(255,\s*255,\s*255,\s*0\.2\)\s*solid\s*transparent;\s*\}/g, '.quiz-progress-dot {\n  flex: 1; height: 8px; border-radius: 4px;\n  background: rgba(255, 255, 255, 0.2);\n  border: 1px solid transparent;\n  transition: all 0.3s;\n}');

css = css.replace(/#FFFFFF;\s*margin-bottom:\s*24px;\s*font-weight:\s*700;\s*padding-bottom:\s*20px;\s*border-bottom:\s*1px\s*solid\s*rgba\(255,255,255,0\.1\);\s*text-align:\s*center;\s*\}/g, '.quiz-question {\n  font-size: 22px; line-height: 1.5; color: #FFFFFF;\n  margin-bottom: 24px; font-weight: 700;\n  padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);\n  text-align: center;\n}');

fs.writeFileSync('src/css/style.css', css, 'utf8');
