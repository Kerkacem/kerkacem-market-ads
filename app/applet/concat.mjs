import fs from 'fs';
fs.writeFileSync('/GEMINI.md', fs.readFileSync('/GEMINI_1.md') + '\n\n' + fs.readFileSync('/GEMINI_2.md'));
fs.unlinkSync('/GEMINI_1.md');
fs.unlinkSync('/GEMINI_2.md');
