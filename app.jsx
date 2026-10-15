const { useState, useEffect, useRef, useMemo } = React;

const PROFILE = {
  name: 'Niko Edrian B. Simangon',
  initials: 'NS',
  school: 'Nueva Vizcaya State University',
  email: 'simangonniko@gmail.com',
  phone: '09995673382',
  facebook: { label: 'Niko Simangon', url: 'https://www.facebook.com/share/1EK8neQxhe/' },
  github: { label: 'GitHub', url: 'https://github.com/simangonnikoooo' },
  photo: 'NIKO.jpg',
};

const ROLES = ['Information Technology Student', 'Aspiring Web Developer', 'Curious problem-solver', 'Always Learning Something New'];

const SKILLS = [
  ['HTML', 'Developing', 70], ['CSS', 'Developing', 65], ['PHP', 'Beginner', 45],
  ['JavaScript', 'Beginner', 50], ['Bootstrap', 'Developing', 60], ['Tailwind CSS', 'Beginner', 50],
  ['React.js', 'Beginner', 40], ['Database Management', 'Beginner', 40],
  ['Responsive Web Design', 'Developing', 60], ['Problem-Solving', 'Developing', 65],
].map(([name, level, value]) => ({ name, level, value }));

const PROJECTS = [
  { t: 'Basic HTML Portfolio', kind: 'Front-end', tags: ['HTML', 'CSS'], d: 'A personal webpage introducing myself, my background, and my interests.' },
  { t: 'Student Registration Form', kind: 'PHP', tags: ['HTML', 'PHP'], d: 'A form that collects student information and displays the submitted details.' },
  { t: 'Student Grade Calculator', kind: 'Front-end', tags: ['HTML', 'JavaScript'], d: "Calculates a student's final grade and shows a passing or failing remark." },
  { t: 'BMI Calculator', kind: 'Front-end', tags: ['HTML', 'JavaScript'], d: 'Calculates Body Mass Index from height and weight.' },
  { t: 'Student Information System', kind: 'PHP', tags: ['PHP', 'Database'], d: 'A simple demonstration of storing, viewing, and managing student records.' },
  { t: 'Login and Registration System', kind: 'PHP', tags: ['PHP', 'Database'], d: 'A basic authentication project with a login form and a registration form.' },
];

const EDUCATION = [
  { level: 'College', school: 'Nueva Vizcaya State University', note: 'Currently pursuing an Information Technology degree' },
  { level: 'Senior High School', school: 'Lawig National High School', note: 'Graduated with honors' },
  { level: 'Junior High School', school: 'Lawig National High School', note: 'Graduated with honors' },
  { level: 'Elementary', school: 'Lawig, Lamut, Ifugao', note: 'Graduated with honors' },
];

const NAV = ['home', 'dashboard', 'skills', 'projects', 'education', 'contact'];
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const o = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), o.disconnect()), { threshold });
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, seen];
}

function useCountUp(target, active, ms = 1000) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf, start;
    const tick = (t) => {
      start = start || t;
      const p = Math.min((t - start) / ms, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return n;
}

function useTyper(words) {
  const [text, setText] = useState(reduceMotion() ? words[0] : '');
  useEffect(() => {
    if (reduceMotion()) return;
    let w = 0, c = 0, del = false, timer;
    const tick = () => {
      const word = words[w];
      c += del ? -1 : 1;
      setText(word.slice(0, c));
      let d = del ? 35 : 70;
      if (!del && c === word.length) { del = true; d = 1500; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 350; }
      timer = setTimeout(tick, d);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);
  return text;
}

/* Card with 3D tilt + cursor spotlight */
function Tilt({ tag: Tag = 'div', className = '', style, children, max = 6, ...rest }) {
  const r = useRef(null);
  const move = (e) => {
    const el = r.current, b = el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
    el.style.setProperty('--mx', x * b.width + 'px');
    el.style.setProperty('--my', y * b.height + 'px');
    if (!reduceMotion()) el.style.transform = `perspective(800px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateY(-4px)`;
  };
  const leave = () => { r.current.style.transform = ''; };
  return <Tag ref={r} onMouseMove={move} onMouseLeave={leave} className={'card spot ' + className} style={style} {...rest}>{children}</Tag>;
}

function Section({ id, eyebrow, title, intro, children }) {
  const [ref, seen] = useInView(0.1);
  return (
    <section id={id} ref={ref} className={'max-w-5xl mx-auto px-5 py-20 reveal ' + (seen ? 'in' : '')}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {intro ? <p className="muted max-w-xl mt-3 mb-8">{intro}</p> : <div className="mb-8" />}
      {children}
    </section>
  );
}

/* ---------------- Global effects ---------------- */
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    };
    f();
    addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  return <div className="progress" ref={ref} aria-hidden="true" />;
}

function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    if (reduceMotion() || !matchMedia('(pointer: fine)').matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf;
    const move = (e) => { tx = e.clientX; ty = e.clientY; ref.current && ref.current.classList.add('on'); };
    const loop = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      if (ref.current) ref.current.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('mousemove', move);
    raf = requestAnimationFrame(loop);
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}

/* ---------------- Nav ---------------- */
function Nav({ dark, toggleTheme, active }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <nav className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between" aria-label="Main">
        <a href="#home" className="font-extrabold tracking-tight text-lg" style={{ color: 'var(--text)' }}>
          N<span className="brand-dot" />Simangon
        </a>
        <ul className={'list-none m-0 p-0 gap-1 ' + (open ? 'flex flex-col absolute top-16 left-0 right-0 p-4 card rounded-none' : 'hidden md:flex')}>
          {NAV.map((id) => (
            <li key={id}>
              <a href={'#' + id} onClick={() => setOpen(false)} className={'nav-link inline-block capitalize ' + (active === id ? 'active' : '')}>{id}</a>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button className="btn btn-icon" type="button" onClick={toggleTheme} title="Toggle theme (T)" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {dark ? '☀' : '☾'}
          </button>
          <button className="btn btn-icon md:hidden" type="button" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ---------------- Home ---------------- */
function Hero() {
  const [imgOk, setImgOk] = useState(true);
  const typed = useTyper(ROLES);
  return (
    <section id="home" className="max-w-5xl mx-auto px-5 pt-36 pb-16 grid md:grid-cols-[1fr_auto] gap-14 items-center">
      <div className="hero-in">
        <p className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full" style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
          <span className="status-dot" /> <span className="muted">Open to learning &amp; opportunities</span>
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold mt-5">
          Hi, I'm <span className="grad">Niko</span>.<br />I build for the web.
        </h1>
        <p className="mono text-base md:text-lg mt-5 min-h-[1.8em]" style={{ color: 'var(--accent-ink)' }} aria-label="Information Technology student">
          &gt; {typed}<span className="caret" />
        </p>
        <p className="muted text-lg max-w-xl mt-3">
          I study Information Technology at {PROFILE.school}.Nueva Vizcaya State University. I enjoy programming and web development, and I am learning to build useful digital solutions. I am always eager to improve my technical skills, explore new technologies, and gain more experience through hands-on projects. My goal is to use my knowledge and creativity to develop systems that can help people and solve real-world problems.
        </p>
        <div className="mt-8 flex gap-3 flex-wrap items-center">
          <a href="#projects" className="btn btn-primary">View projects →</a>
          <a href="#contact" className="btn">Contact me</a>
          <span className="muted text-xs hidden md:inline">Tip: press <kbd>T</kbd> to switch theme</span>
        </div>
      </div>
      <div className="avatar-wrap">
        <figure className="avatar">
          <span>{PROFILE.initials}</span>
          {imgOk && <img src={PROFILE.photo} alt={'Portrait of ' + PROFILE.name} onError={() => setImgOk(false)} />}
        </figure>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Bootstrap', 'PHP', 'Databases', 'Responsive Design', 'Problem-Solving'];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Stat({ label, value, suffix = '', active, hint, i }) {
  const n = useCountUp(value, active);
  return (
    <Tilt className="lift pop" style={{ '--i': i }}>
      <p className="muted text-sm">{label}</p>
      <p className="text-4xl font-extrabold mt-1 tracking-tight" style={{ color: 'var(--accent-ink)' }}>{n}{suffix}</p>
      <p className="muted text-xs mt-1">{hint}</p>
    </Tilt>
  );
}

function Dashboard({ onPickTech }) {
  const [ref, seen] = useInView(0.15);
  const [level, setLevel] = useState('All');
  const [hover, setHover] = useState(null);

  const avg = Math.round(SKILLS.reduce((s, k) => s + k.value, 0) / SKILLS.length);
  const techCounts = useMemo(() => {
    const m = {};
    PROJECTS.forEach((p) => p.tags.forEach((t) => (m[t] = (m[t] || 0) + 1)));
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, []);
  const maxTech = techCounts[0][1];
  const frontEnd = PROJECTS.filter((p) => p.kind === 'Front-end').length;
  const php = PROJECTS.length - frontEnd;
  const deg = (frontEnd / PROJECTS.length) * 360;
  const shown = SKILLS.filter((s) => level === 'All' || s.level === level).sort((a, b) => b.value - a.value);
  const hs = hover && SKILLS.find((s) => s.name === hover);

  return (
    <Section id="dashboard" eyebrow="01 / Dashboard" title="At a glance" intro="A quick summary of my skills and projects. Hover a skill, or click a technology to see the projects that use it.">
      <div ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat i={0} label="Skills" value={SKILLS.length} active={seen} hint="being learned" />
          <Stat i={1} label="Projects" value={PROJECTS.length} active={seen} hint="beginner demos" />
          <Stat i={2} label="Avg. progress" value={avg} suffix="%" active={seen} hint="my own estimate" />
          <Stat i={3} label="Technologies" value={techCounts.length} active={seen} hint="used in projects" />
        </div>

        <div className="grid lg:grid-cols-5 gap-4 mt-4">
          <div className="card lg:col-span-3 pop" style={{ '--i': 4 }}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-lg font-bold">Skill progress</h3>
              <div className="flex gap-2" role="group" aria-label="Filter skills by level">
                {['All', 'Developing', 'Beginner'].map((l) => (
                  <button key={l} type="button" className={'chip ' + (level === l ? 'on' : '')} aria-pressed={level === l} onClick={() => setLevel(l)}>{l}</button>
                ))}
              </div>
            </div>
            <p className="mono text-xs mb-2 min-h-[1.2em]" style={{ color: 'var(--accent-ink)' }}>
              {hs ? `${hs.name}: ${hs.level} (${hs.value}%)` : `${shown.length} skill${shown.length === 1 ? '' : 's'} shown`}
            </p>
            <ul className="list-none m-0 p-0">
              {shown.map((s) => (
                <li key={s.name} className="row-hover" onMouseEnter={() => setHover(s.name)} onMouseLeave={() => setHover(null)}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{s.name}</span>
                    <span className="muted mono">{s.value}%</span>
                  </div>
                  <div className="track" role="progressbar" aria-label={s.name} aria-valuenow={s.value} aria-valuemin="0" aria-valuemax="100">
                    <div className="fill" style={{ width: seen ? s.value + '%' : 0 }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="card pop" style={{ '--i': 5 }}>
              <h3 className="text-lg font-bold mb-3">Projects by type</h3>
              <div className="flex items-center gap-5">
                <div className={'donut ' + (seen ? '' : 'hidden-d')} style={{ background: `conic-gradient(var(--accent) 0deg ${deg}deg, #ffd9a0 ${deg}deg 360deg)` }} role="img" aria-label={`${frontEnd} front-end projects, ${php} PHP projects`}>
                  <div className="donut-center"><div><strong className="text-2xl">{PROJECTS.length}</strong><br /><span className="muted text-xs">projects</span></div></div>
                </div>
                <ul className="list-none m-0 p-0 text-sm space-y-2">
                  <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: 'var(--accent)' }} /> Front-end <span className="muted mono">{frontEnd}</span></li>
                  <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#ffd9a0' }} /> PHP <span className="muted mono">{php}</span></li>
                </ul>
              </div>
            </div>

            <div className="card flex-1 pop" style={{ '--i': 6 }}>
              <h3 className="text-lg font-bold mb-2">Technologies used</h3>
              {techCounts.map(([t, c]) => (
                <button key={t} type="button" className="bar-btn" onClick={() => onPickTech(t)} aria-label={`Show ${c} projects using ${t}`}>
                  <div className="flex justify-between text-sm mb-1"><span>{t}</span><span className="muted mono">{c}</span></div>
                  <div className="track"><div className="fill" style={{ width: seen ? (c / maxTech) * 100 + '%' : 0 }} /></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- Skills ---------------- */
function Skills() {
  const [ref, seen] = useInView(0.2);
  const groups = [
    ['Front-end', ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Tailwind CSS', 'React.js', 'Responsive Web Design']],
    ['Back-end & data', ['PHP', 'Database Management']],
    ['Soft skills', ['Problem-Solving']],
  ];
  return (
    <Section id="skills" eyebrow="02 / Skills" title="What I'm learning" intro="These are skills I am still growing. The bars show my own estimate of progress, not mastery.">
      <div ref={ref} className="grid md:grid-cols-3 gap-4">
        {groups.map(([title, names], gi) => (
          <Tilt key={title} className="lift pop" style={{ '--i': gi }}>
            <h3 className="text-base font-bold mb-3">{title}</h3>
            {names.map((n) => {
              const s = SKILLS.find((k) => k.name === n);
              return (
                <div key={n} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-sm mb-1.5"><span>{n}</span><span className="muted text-xs">{s.level}</span></div>
                  <div className="track"><div className="fill" style={{ width: seen ? s.value + '%' : 0 }} /></div>
                </div>
              );
            })}
          </Tilt>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Projects ---------------- */
function Projects({ tech, setTech }) {
  const [openIdx, setOpenIdx] = useState(null);
  const [q, setQ] = useState('');
  const [sortAZ, setSortAZ] = useState(false);
  const tags = ['All', ...Array.from(new Set(PROJECTS.flatMap((p) => p.tags)))];

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let l = PROJECTS.filter((p) =>
      (tech === 'All' || p.tags.includes(tech)) &&
      (!term || (p.t + ' ' + p.d + ' ' + p.tags.join(' ')).toLowerCase().includes(term)));
    if (sortAZ) l = [...l].sort((a, b) => a.t.localeCompare(b.t));
    return l;
  }, [tech, q, sortAZ]);

  const open = openIdx !== null ? list[openIdx] : null;
  const closeRef = useRef(null);
  const step = (d) => setOpenIdx((i) => (i + d + list.length) % list.length);

  useEffect(() => {
    const k = (e) => {
      if (openIdx === null) return;
      if (e.key === 'Escape') setOpenIdx(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [openIdx, list.length]);
  useEffect(() => { if (open && closeRef.current) closeRef.current.focus(); }, [openIdx]);

  return (
    <Section id="projects" eyebrow="03 / Projects" title="Things I've built" intro="Beginner and demonstration projects. Source code links will be added when they are published.">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input className="field" style={{ maxWidth: 260 }} type="search" placeholder="Search projects…" aria-label="Search projects" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className={'chip ' + (sortAZ ? 'on' : '')} aria-pressed={sortAZ} onClick={() => setSortAZ(!sortAZ)}>Sort A–Z</button>
        <span className="muted text-sm mono">{list.length} of {PROJECTS.length}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter projects by technology">
        {tags.map((t) => (
          <button key={t} type="button" className={'chip ' + (tech === t ? 'on' : '')} aria-pressed={tech === t} onClick={() => setTech(t)}>{t}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card text-center muted">
          No projects match that search.{' '}
          <button type="button" className="copy-btn" onClick={() => { setQ(''); setTech('All'); }}>Clear filters</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p, i) => (
            <Tilt tag="article" key={p.t} className="lift pop flex flex-col" style={{ '--i': i }}>
              <span className="muted mono text-xs mb-2">{p.kind}</span>
              <h3 className="text-lg font-bold">{p.t}</h3>
              <p className="muted text-sm mt-2 flex-1">{p.d}</p>
              <div className="mt-3">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              <button type="button" className="btn btn-sm self-start mt-1" onClick={() => setOpenIdx(i)}>View details</button>
            </Tilt>
          ))}
        </div>
      )}

      {open && (
        <div className="modal-bg" onClick={() => setOpenIdx(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label={open.t} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <span className="tag">Beginner / demonstration project</span>
              <span className="muted mono text-xs">{openIdx + 1} / {list.length}</span>
            </div>
            <h3 className="text-xl font-bold">{open.t}</h3>
            <p className="mt-2">{open.d}</p>
            <p className="muted text-sm mt-2">Built with: {open.tags.join(', ')}</p>
            <p className="muted text-sm">Source code: not published yet.</p>
            <div className="flex gap-2 mt-5 items-center">
              <button type="button" className="btn btn-sm btn-icon" aria-label="Previous project" onClick={() => step(-1)}>←</button>
              <button type="button" className="btn btn-sm btn-icon" aria-label="Next project" onClick={() => step(1)}>→</button>
              <button ref={closeRef} type="button" className="btn btn-primary btn-sm ml-auto" onClick={() => setOpenIdx(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ---------------- Education ---------------- */
function Education() {
  return (
    <Section id="education" eyebrow="04 / Education" title="Educational background">
      <ol className="timeline">
        {EDUCATION.map((e, i) => (
          <li key={e.level} className="pop" style={{ '--i': i + 2 }}>
            <h3 className="text-lg font-bold">{e.level}</h3>
            <p>{e.school}</p>
            <p className="muted text-sm">{e.note}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------- Contact ---------------- */
function Contact({ notify }) {
  const empty = { name: '', email: '', subject: '', message: '' };
  const [v, setV] = useState(empty);
  const [errs, setErrs] = useState({});
  const [sent, setSent] = useState(false);

  const copy = async (text, label) => {
    try { await navigator.clipboard.writeText(text); notify(label + ' copied'); }
    catch (e) { notify('Could not copy. Select it manually.'); }
  };
  const validate = () => {
    const e = {};
    if (v.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address.';
    if (v.subject.trim().length < 3) e.subject = 'Enter a subject (at least 3 characters).';
    if (v.message.trim().length < 10) e.message = 'Enter a message (at least 10 characters).';
    return e;
  };
  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrs(e);
    if (Object.keys(e).length) return;
    const body = encodeURIComponent(`${v.message}\n\n— ${v.name} (${v.email})`);
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(v.subject)}&body=${body}`;
    setSent(true);
    setV(empty);
    notify('Opening your email app…');
  };
  const field = (k, label, props = {}) => (
    <div className="mb-4">
      <label htmlFor={k} className="flex justify-between text-sm font-medium mb-1.5">
        <span>{label}</span>
        {props.area && <span className="muted mono text-xs">{v[k].length}/2000</span>}
      </label>
      {props.area
        ? <textarea id={k} rows="4" maxLength="2000" className={'field ' + (errs[k] ? 'bad' : '')} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
        : <input id={k} type={props.type || 'text'} className={'field ' + (errs[k] ? 'bad' : '')} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />}
      {errs[k] && <p className="err" role="alert">{errs[k]}</p>}
    </div>
  );
  const link = (item) => item.url
    ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>
    : <span className="muted">{item.label} (link not added yet)</span>;

  return (
    <Section id="contact" eyebrow="05 / Contact" title="Let's talk" intro="Open to opportunities, collaborations, and questions.">
      <div className="grid md:grid-cols-2 gap-10">
        <ul className="list-none m-0 p-0 space-y-4">
          <li className="pop" style={{ '--i': 0 }}><span className="muted text-sm block">Email</span>
            <a href={'mailto:' + PROFILE.email}>{PROFILE.email}</a> <button type="button" className="copy-btn" onClick={() => copy(PROFILE.email, 'Email')}>Copy</button></li>
          <li className="pop" style={{ '--i': 1 }}><span className="muted text-sm block">Phone</span>
            <a href={'tel:+63' + PROFILE.phone.slice(1)}>{PROFILE.phone}</a> <button type="button" className="copy-btn" onClick={() => copy(PROFILE.phone, 'Phone number')}>Copy</button></li>
          <li className="pop" style={{ '--i': 2 }}><span className="muted text-sm block">Facebook</span>{link(PROFILE.facebook)}</li>
          <li className="pop" style={{ '--i': 3 }}><span className="muted text-sm block">GitHub</span>{link(PROFILE.github)}</li>
        </ul>
        <form onSubmit={submit} noValidate className="card pop" style={{ '--i': 2 }}>
          {sent && <p className="text-sm mb-4 p-3 rounded-lg" style={{ background: 'var(--accent-soft)', color: 'var(--accent-ink)' }} role="status">Your email app should open with the message ready to send. Nothing is sent until you press send there.</p>}
          {field('name', 'Name')}
          {field('email', 'Email', { type: 'email' })}
          {field('subject', 'Subject')}
          {field('message', 'Message', { area: true })}
          <button type="submit" className="btn btn-primary">Send message</button>
        </form>
      </div>
    </Section>
  );
}

/* ---------------- App ---------------- */
function App() {
  const [dark, setDark] = useState(() => {
    try { const s = localStorage.getItem('theme'); if (s) return s === 'dark'; } catch (e) {}
    return true; // black & orange is the default look
  });
  const [active, setActive] = useState('home');
  const [tech, setTech] = useState('All');
  const [showTop, setShowTop] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const notify = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  }, [dark]);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' });
    NAV.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    const onScroll = () => setShowTop(scrollY > 500);
    addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    const k = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.toLowerCase() === 't') setDark((d) => !d);
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);

  const pickTech = (t) => {
    setTech(t);
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    notify('Showing ' + t + ' projects');
  };

  return (
    <>
      <div className="orb a" aria-hidden="true" /><div className="orb b" aria-hidden="true" />
      <ScrollProgress />
      <CursorGlow />
      <Nav dark={dark} toggleTheme={() => setDark(!dark)} active={active} />
      <main>
        <Hero />
        <Marquee />
        <Dashboard onPickTech={pickTech} />
        <Skills />
        <Projects tech={tech} setTech={setTech} />
        <Education />
        <Contact notify={notify} />
      </main>
      <footer className="text-center py-8 muted text-sm" style={{ borderTop: '1px solid var(--line)' }}>
        &copy; {new Date().getFullYear()} {PROFILE.name}
      </footer>
      <div className={'toast ' + (toast ? 'show' : '')} role="status" aria-live="polite">{toast}</div>
      <button type="button" className={'btn btn-icon to-top ' + (showTop ? 'show' : '')} aria-label="Scroll to top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
