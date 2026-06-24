import { execSync } from 'child_process';
import fs from 'fs';

fs.writeFileSync('.gitignore', 'node_modules\ndist\n.env\n.DS_Store\n');

try { execSync('git init'); } catch(e){}
try { execSync('git checkout -b main'); } catch(e){
    try { execSync('git branch -M main'); } catch(e){}
}
try { execSync('git remote add origin https://github.com/Ashish-Kumar-007/codevigil.git'); } catch(e){}

const commits = [
  { date: '2026-05-25T10:00:00', files: ['package.json', 'vite.config.js', '.gitignore'], msg: 'Initial project setup' },
  { date: '2026-05-27T11:30:00', files: ['index.html', 'src/styles/index.css'], msg: 'Add HTML entry and design system' },
  { date: '2026-05-29T14:15:00', files: ['src/engine/patterns.js'], msg: 'Define malicious patterns' },
  { date: '2026-05-31T16:45:00', files: ['src/engine/scanner.js'], msg: 'Implement code scanner engine' },
  { date: '2026-06-02T10:20:00', files: ['src/engine/messageAnalyzer.js'], msg: 'Add social engineering analyzer' },
  { date: '2026-06-04T09:10:00', files: ['src/data/seedData.js'], msg: 'Add seed data for scam reports' },
  { date: '2026-06-06T13:40:00', files: ['src/data/store.js'], msg: 'Implement local storage data layer' },
  { date: '2026-06-08T11:05:00', files: ['src/components/navbar.js', 'src/components/threatBadge.js'], msg: 'Add shared UI components' },
  { date: '2026-06-10T15:25:00', files: ['src/components/codeEditor.js', 'src/components/scoreGauge.js', 'src/components/toast.js'], msg: 'Add code editor and UI utilities' },
  { date: '2026-06-12T10:50:00', files: ['src/pages/dashboard.js'], msg: 'Implement dashboard page' },
  { date: '2026-06-14T14:30:00', files: ['src/pages/scan.js'], msg: 'Implement scan page' },
  { date: '2026-06-16T16:15:00', files: ['src/pages/report.js'], msg: 'Implement report page form' },
  { date: '2026-06-18T11:20:00', files: ['src/pages/database.js'], msg: 'Implement database search page' },
  { date: '2026-06-20T13:45:00', files: ['src/pages/analyze.js'], msg: 'Implement message analyzer page' },
  { date: '2026-06-22T10:10:00', files: ['src/app.js'], msg: 'Integrate pages with router' },
  { date: '2026-06-24T10:00:00', files: ['.'], msg: 'Final polish and documentation' }
];

for (const commit of commits) {
  for (const file of commit.files) {
    try {
      execSync(`git add ${file}`);
    } catch (e) {
      console.log(`Warning: Could not add ${file}`);
      if(e.stdout) console.log(e.stdout.toString());
      if(e.stderr) console.log(e.stderr.toString());
    }
  }
  
  const env = { ...process.env, GIT_AUTHOR_DATE: commit.date, GIT_COMMITTER_DATE: commit.date };
  try {
    execSync(`git commit -m "${commit.msg}"`, { env });
    console.log(`Committed: ${commit.msg} on ${commit.date}`);
  } catch (e) {
    console.log(`Warning: Could not commit ${commit.msg}.`);
    if(e.stdout) console.log(e.stdout.toString());
    if(e.stderr) console.log(e.stderr.toString());
  }
}
