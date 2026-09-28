const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Skills data ---------- */
const SKILLS = [
  ['Splunk & SIEM', ['Splunk Enterprise','Enterprise Security','SPL','Indexer Clustering','Searchhead Clustering','Multi-Cluster Search','Monitoring Console','Dashboards & Alerts','Scheduled Reports']],
  ['Log Management', ['Log Collection','Normalization','Processing & Retention','Index Policies','Disk Optimization','Input Traffic Filtering']],
  ['Security', ['Suricata','ModSecurity','FortiWeb','HAProxy','IPS / Firewall','Web App Attacks (SQLi / XSS / DoS)','WAPT','CEH']],
  ['Infrastructure', ['Linux','Docker','Bash Scripting','GitLab CI','Distributed Infrastructure','Virtualization','LPIC2']],
  ['Development', ['Python','Regex','Automated Testing','Test Scenario Design','CI/CD Deployment']],
  ['Certifications', ['CCNA','MCITP','LPIC2','CEH (Advanced)','WAPT','Splunk Enterprise Security']],
];
const grid = document.getElementById('skill-grid');
grid.innerHTML = SKILLS.map(([cat, tags]) => `
  <div class="card reveal"><h3>${cat}</h3>
  <div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div>`).join('');

/* ---------- Mobile nav ---------- */
const btn = document.querySelector('.menu'), nav = document.querySelector('nav');
btn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}));

/* ---------- Terminal log animation ---------- */
const lines = [
  ['08:41:02', 'index=main', 'NetworkTraffic', 'src=10.2.14.87 dst=172.16.4.11 action=allowed bytes=1482'],
  ['08:41:05', 'index=firewall', 'fortiweb_traffic', 'policy=web-04 verdict=pass threat=none latency=12ms'],
  ['08:41:09', 'index=security', 'suricata_alert', 'signature="ET SCAN Possible Nmap" severity=high src=203.0.113.77'],
  ['08:41:13', 'index=web', 'modsecurity_audit', 'rule_id=942100 msg="SQL Injection Attack Detected" status=403'],
  ['08:41:17', 'index=wazuh', 'fim_event', 'path=/etc/shadow agent=web-01 changed=attrs user=root'],
  ['08:41:21', 'index=osquery', 'sysmon_process', 'proc=sshd.exe parent=cmd.exe hash=4f8a...c2 host=srv-02'],
  ['08:41:26', 'index=main', 'hacluster_status', 'node=searchhead-01 state=healthy peers=3 backlog=0'],
  ['08:41:30', 'index=metrics', 'splunk_health', 'idx_disk=62% queue_depth=8 ingest=1.4GB/h status=OK'],
];
const box = document.getElementById('logs');
let i = 0;
function push() {
  const [t, idx, st, msg] = lines[i % lines.length];
  const div = document.createElement('div');
  div.className = 'log';
  div.innerHTML = `<em>${t}</em> ${idx} sourcetype=${st} ${msg}`;
  box.appendChild(div);
  while (box.children.length > 9) box.firstChild.remove();
  i++;
  setTimeout(push, reduced ? 800 : 1400);
}
push();

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => reduced ? el.classList.add('visible') : io.observe(el));

/* ---------- Active nav highlight ---------- */
const links = [...nav.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && spy.observe(s));
