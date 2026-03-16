import { useState, useEffect, useRef } from 'react'
import { authAPI, dressAPI, categoryAPI, testimonialAPI, instaAPI, brandAPI, heroAPI } from '../services/api'
import Cursor from './Cursor'
import styles from './AdminPanel.module.css'

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')

// ── SMALL HELPERS ─────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [])
  if (!msg) return null
  return <div className={`${styles.toast} ${type === 'error' ? styles.toastErr : styles.toastOk}`}>{msg}</div>
}

function Confirm({ msg, onYes, onNo }) {
  return (
    <div className={styles.confirmBg}>
      <div className={styles.confirmBox}>
        <p>{msg}</p>
        <div className={styles.confirmBtns}>
          <button className={styles.btnDanger} onClick={onYes}>Yes, delete</button>
          <button className={styles.btnGhost} onClick={onNo}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ── LOGIN SCREEN ──────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [u, setU] = useState(''); const [p, setP] = useState('')
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      const res = await authAPI.login(u, p)
      localStorage.setItem('kb_admin_token', res.token)
      onLogin()
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <h1 className={styles.loginTitle}>Kriya Boutique</h1>
        <p className={styles.loginSub}>Admin Panel</p>
        <form onSubmit={submit} className={styles.loginForm}>
          <input className={styles.inp} placeholder="Username" value={u}
            onChange={e => setU(e.target.value)} required autoFocus />
          <input className={styles.inp} type="password" placeholder="Password"
            value={p} onChange={e => setP(e.target.value)} required />
          {err && <p className={styles.loginErr}>{err}</p>}
          <button className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── DRESSES TAB ───────────────────────────────────────
function DressesTab({ toast }) {
  const [dresses, setDresses]   = useState([])
  const [cats, setCats]         = useState([])
  const [editing, setEditing]   = useState(null)   // null | 'new' | dress object
  const [confirm, setConfirm]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const fileRef = useRef()

const BLANK = { name:'', nameEn:'', category:'festive', badge:'', tag:'', desc:'',
  fabric:'', work:'', sizes:'', lead:'', price:'', accentColor:'#c8a45a',
  swatches:['#c8a45a'], colors:['Gold'], photos:[], showcase: false }

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [d, c] = await Promise.all([dressAPI.getAll(), categoryAPI.getAll()])
      setDresses(d); setCats(c.filter(c => c.id !== 'all' && c.id !== 'new'))
    } catch (e) { toast(e.message, 'error') }
    finally { setLoading(false) }
  }

  const save = async () => {
    try {
      const fd  = new FormData()
      const data = { ...editing }
      const files = fileRef.current?.files || []
      const kept  = data.photos?.filter(p => typeof p === 'string') || []
      data.photos = kept
      fd.append('data', JSON.stringify(data))
      Array.from(files).forEach(f => fd.append('photos', f))

      if (editing._id) await dressAPI.update(editing._id, fd)
      else             await dressAPI.create(fd)
      toast('Saved!', 'ok')
      setEditing(null)
      load()
    } catch (e) { toast(e.message, 'error') }
  }

  const del = async (id) => {
    try { await dressAPI.delete(id); toast('Deleted', 'ok'); load() }
    catch (e) { toast(e.message, 'error') }
    finally { setConfirm(null) }
  }

  const field = (k, label, opts = {}) => (
    <div className={styles.field}>
      <label className={styles.lbl}>{label}</label>
      {opts.textarea
        ? <textarea className={styles.inp} rows={3} value={editing[k] || ''}
            onChange={e => setEditing(v => ({...v, [k]: e.target.value}))} />
        : opts.select
        ? <select className={styles.inp} value={editing[k] || ''}
            onChange={e => setEditing(v => ({...v, [k]: e.target.value}))}>
            {opts.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        : <input className={styles.inp} type={opts.type || 'text'} value={editing[k] || ''}
            onChange={e => setEditing(v => ({...v, [k]: e.target.value}))} />
      }
    </div>
  )

  if (loading) return <div className={styles.loading}>Loading dresses...</div>

  if (editing) return (
    <div className={styles.formWrap}>
      <div className={styles.formHeader}>
        <h2>{editing._id ? 'Edit Dress' : 'Add New Dress'}</h2>
        <button className={styles.btnGhost} onClick={() => setEditing(null)}>← Back</button>
      </div>
      <div className={styles.formGrid}>
        {field('name',     'Dress Name *')}
        {field('nameEn',   'English Sub-title')}
        {field('tag',      'Collection Tag')}
        {field('category', 'Category', { select: true, options: cats.map(c => ({value: c.id, label: c.label})) })}
        {field('badge',    'Badge', { select: true, options: [
          {value:'',label:'None'},{value:'new',label:'New'},{value:'bestseller',label:'Bestseller'},{value:'sold-out',label:'Sold Out'}
        ]})}
        {field('price',    'Price (e.g. ₹45,000)')}
        {field('fabric',   'Fabric')}
        {field('work',     'Embroidery Work')}
        {field('sizes',    'Available Sizes')}
        {field('lead',     'Lead Time')}
        {field('accentColor', 'Accent Colour', { type: 'color' })}
        {field('desc',     'Description', { textarea: true })}
        </div>

      {/* Showcase toggle */}
      <div className={styles.showcaseToggle}>
        <label className={styles.showcaseLabel}>
          <input
            type="checkbox"
            className={styles.showcaseCheck}
            checked={!!editing.showcase}
            onChange={e => setEditing(v => ({ ...v, showcase: e.target.checked }))}
          />
          <span className={styles.showcaseText}>✦ Show in Showcase</span>
          <span className={styles.showcaseHint}>
            Showcase dresses appear as large hero cards at the top of the page
          </span>
        </label>
      </div>

      {/* Current photos */}
      {editing.photos?.length > 0 && (
        <div className={styles.photoGrid}>
          {editing.photos.filter(p => typeof p === 'string').map((p, i) => (
            <div key={i} className={styles.photoThumb}>
              <img src={p.startsWith('/uploads') ? `${BASE_URL}${p}` : p} alt="" />
              <button className={styles.photoDelete}
                onClick={() => setEditing(v => ({...v, photos: v.photos.filter((_,j)=>j!==i)}))}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.lbl}>Upload Photos (up to 5)</label>
        <input type="file" ref={fileRef} multiple accept="image/*" className={styles.fileInp} />
      </div>

      <div className={styles.formActions}>
        <button className={styles.btnPrimary} onClick={save}>Save Dress</button>
        <button className={styles.btnGhost} onClick={() => setEditing(null)}>Cancel</button>
      </div>
    </div>
  )

  return (
    <div>
      <div className={styles.tabHeader}>
        <h2>Dresses <span className={styles.count}>{dresses.length}</span></h2>
        <button className={styles.btnPrimary} onClick={() => setEditing(BLANK)}>+ Add Dress</button>
      </div>
      <div className={styles.list}>
        {dresses.map(d => (
          <div key={d._id} className={styles.listItem}>
            <img src={d.photos?.[0] ? `${BASE_URL}${d.photos[0]}` : '/lehenga1.png'}
              alt={d.name} className={styles.listImg} />
            <div className={styles.listInfo}>
              <p className={styles.listName}>{d.name}</p>
              <p className={styles.listSub}>{d.tag} · {d.price}</p>
              {d.badge && <span className={styles.badge}>{d.badge}</span>}
              {d.showcase && <span className={styles.showcasePill}>✦ Showcase</span>}
            </div>
            <div className={styles.listActions}>
              <button className={styles.btnSm} onClick={() => setEditing(d)}>Edit</button>
              <button className={styles.btnSmDanger}
                onClick={() => setConfirm({ msg: `Delete "${d.name}"?`, id: d._id })}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {confirm && <Confirm msg={confirm.msg} onYes={() => del(confirm.id)} onNo={() => setConfirm(null)} />}
    </div>
  )
}

// ── CATEGORIES TAB ────────────────────────────────────
function CategoriesTab({ toast }) {
  const [cats, setCats]   = useState([])
  const [form, setForm]   = useState({ id:'', label:'', color:'#c8a45a' })
  const [editing, setEdit]= useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { setCats(await categoryAPI.getAll()) } catch (e) { toast(e.message,'error') }
  }

  const save = async () => {
    try {
      if (editing) await categoryAPI.update(editing._id, form)
      else         await categoryAPI.create(form)
      toast('Saved!','ok'); setForm({ id:'',label:'',color:'#c8a45a' }); setEdit(null); load()
    } catch (e) { toast(e.message,'error') }
  }

  const del = async (id) => {
    try { await categoryAPI.delete(id); toast('Deleted','ok'); load() }
    catch (e) { toast(e.message,'error') }
    finally { setConfirm(null) }
  }

  return (
    <div>
      <div className={styles.tabHeader}><h2>Collections / Categories</h2></div>
      <div className={styles.splitLayout}>
        <div>
          <h3 className={styles.sectionTitle}>{editing ? 'Edit Category' : 'Add New Category'}</h3>
          <div className={styles.field}><label className={styles.lbl}>ID (lowercase, no spaces)</label>
            <input className={styles.inp} value={form.id} placeholder="e.g. bridal"
              onChange={e => setForm(v=>({...v,id:e.target.value}))} disabled={!!editing} /></div>
          <div className={styles.field}><label className={styles.lbl}>Display Label</label>
            <input className={styles.inp} value={form.label} placeholder="e.g. Bridal"
              onChange={e => setForm(v=>({...v,label:e.target.value}))} /></div>
          <div className={styles.field}><label className={styles.lbl}>Colour</label>
            <input type="color" className={styles.inp} value={form.color}
              onChange={e => setForm(v=>({...v,color:e.target.value}))} /></div>
          <div className={styles.formActions}>
            <button className={styles.btnPrimary} onClick={save}>Save</button>
            {editing && <button className={styles.btnGhost} onClick={() => { setEdit(null); setForm({id:'',label:'',color:'#c8a45a'}) }}>Cancel</button>}
          </div>
        </div>
        <div>
          <h3 className={styles.sectionTitle}>Existing Categories</h3>
          {cats.map(c => (
            <div key={c._id} className={styles.listItem}>
              <span className={styles.colorDot} style={{ background: c.color }} />
              <div className={styles.listInfo}><p className={styles.listName}>{c.label}</p><p className={styles.listSub}>{c.id}</p></div>
              <div className={styles.listActions}>
                <button className={styles.btnSm} onClick={() => { setEdit(c); setForm(c) }}>Edit</button>
                <button className={styles.btnSmDanger} onClick={() => setConfirm({ msg:`Delete "${c.label}"?`, id:c._id })}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {confirm && <Confirm msg={confirm.msg} onYes={() => del(confirm.id)} onNo={() => setConfirm(null)} />}
    </div>
  )
}

// ── TESTIMONIALS TAB ──────────────────────────────────
function TestimonialsTab({ toast }) {
  const [list, setList]   = useState([])
  const [form, setForm]   = useState({ name:'', occasion:'', rating:5, text:'', location:'' })
  const [editing, setEdit]= useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { setList(await testimonialAPI.getAll()) } catch (e) { toast(e.message,'error') }
  }

  const save = async () => {
    try {
      if (editing) await testimonialAPI.update(editing._id, form)
      else         await testimonialAPI.create(form)
      toast('Saved!','ok'); setForm({ name:'',occasion:'',rating:5,text:'',location:'' }); setEdit(null); load()
    } catch (e) { toast(e.message,'error') }
  }

  const del = async (id) => {
    try { await testimonialAPI.delete(id); toast('Deleted','ok'); load() }
    catch (e) { toast(e.message,'error') }
    finally { setConfirm(null) }
  }

  const f = (k, label, opts={}) => (
    <div className={styles.field}><label className={styles.lbl}>{label}</label>
      {opts.textarea
        ? <textarea className={styles.inp} rows={3} value={form[k]||''} onChange={e=>setForm(v=>({...v,[k]:e.target.value}))} />
        : <input className={styles.inp} type={opts.type||'text'} value={form[k]||''} onChange={e=>setForm(v=>({...v,[k]:e.target.value}))} />
      }
    </div>
  )

  return (
    <div>
      <div className={styles.tabHeader}><h2>Testimonials <span className={styles.count}>{list.length}</span></h2></div>
      <div className={styles.splitLayout}>
        <div>
          <h3 className={styles.sectionTitle}>{editing ? 'Edit Review' : 'Add Review'}</h3>
          {f('name',     'Customer Name *')}
          {f('occasion', 'Occasion (e.g. Bridal Lehenga — Dec 2024)')}
          {f('location', 'City')}
          <div className={styles.field}><label className={styles.lbl}>Rating</label>
            <select className={styles.inp} value={form.rating} onChange={e=>setForm(v=>({...v,rating:Number(e.target.value)}))}>
              {[5,4,3,2,1].map(n=><option key={n} value={n}>{'★'.repeat(n)}</option>)}
            </select>
          </div>
          {f('text', 'Review Text *', { textarea: true })}
          <div className={styles.formActions}>
            <button className={styles.btnPrimary} onClick={save}>Save</button>
            {editing && <button className={styles.btnGhost} onClick={()=>{setEdit(null);setForm({name:'',occasion:'',rating:5,text:'',location:''})}}>Cancel</button>}
          </div>
        </div>
        <div>
          {list.map(t => (
            <div key={t._id} className={styles.listItem}>
              <div className={styles.reviewerInitial}>{t.name[0]}</div>
              <div className={styles.listInfo}>
                <p className={styles.listName}>{t.name}</p>
                <p className={styles.listSub}>{'★'.repeat(t.rating)} · {t.location}</p>
              </div>
              <div className={styles.listActions}>
                <button className={styles.btnSm} onClick={()=>{setEdit(t);setForm(t)}}>Edit</button>
                <button className={styles.btnSmDanger} onClick={()=>setConfirm({msg:`Delete review by "${t.name}"?`,id:t._id})}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {confirm && <Confirm msg={confirm.msg} onYes={()=>del(confirm.id)} onNo={()=>setConfirm(null)} />}
    </div>
  )
}

// ── BRAND SETTINGS TAB ────────────────────────────────
function BrandTab({ toast }) {
  const [form, setForm]         = useState(null)
  const [activeSection, setSection] = useState('contact')
  const heroRef = useRef()

  useEffect(() => {
    Promise.all([brandAPI.get(), heroAPI.get()]).then(([b, h]) => {
      // processSteps may come back as array or JSON string — normalise
      let steps = b.processSteps
      if (typeof steps === 'string') { try { steps = JSON.parse(steps) } catch { steps = [] } }
      setForm({ ...b, processSteps: Array.isArray(steps) ? steps : [], heroPhoto: h.photo })
    }).catch(e => toast(e.message, 'error'))
  }, [])

  const saveBrand = async () => {
    try {
      const { heroPhoto, ...brandData } = form
      await brandAPI.update(brandData)
      toast('Settings saved!', 'ok')
    } catch (e) { toast(e.message, 'error') }
  }

  const saveHero = async () => {
    try {
      const file = heroRef.current?.files?.[0]
      if (!file) return toast('Please select a photo first', 'error')
      const fd = new FormData(); fd.append('photo', file)
      await heroAPI.upload(fd)
      toast('Hero photo updated!', 'ok')
    } catch (e) { toast(e.message, 'error') }
  }

  if (!form) return <div className={styles.loading}>Loading settings...</div>

  const inp = (k, label, opts = {}) => (
    <div className={styles.field}>
      <label className={styles.lbl}>{label}</label>
      {opts.textarea
        ? <textarea className={styles.inp} rows={opts.rows || 3} value={form[k] || ''}
            onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} />
        : <input className={styles.inp} value={form[k] || ''}
            onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} />
      }
      {opts.hint && <p className={styles.helpText}>{opts.hint}</p>}
    </div>
  )

  // Process step helpers
  const setStep = (i, k, val) => {
    const steps = [...(form.processSteps || [])]
    steps[i] = { ...steps[i], [k]: val }
    setForm(v => ({ ...v, processSteps: steps }))
  }
  const addStep = () => {
    const steps = [...(form.processSteps || [])]
    steps.push({ num: String(steps.length + 1).padStart(2, '0'), icon: '✦', title: '', desc: '' })
    setForm(v => ({ ...v, processSteps: steps }))
  }
  const removeStep = i => {
    const steps = [...(form.processSteps || [])]
    steps.splice(i, 1)
    setForm(v => ({ ...v, processSteps: steps }))
  }

  const sections = [
    { id: 'contact', label: '📞 Contact & Identity' },
    { id: 'content', label: '✏️ Texts & Content' },
    { id: 'process', label: '🪡 Process Steps' },
    { id: 'hero',    label: '🖼️ Hero Photo' },
  ]

  return (
    <div>
      <div className={styles.tabHeader}><h2>Brand & Site Settings</h2></div>

      {/* Sub-navigation */}
      <div className={styles.subNav}>
        {sections.map(s => (
          <button key={s.id}
            className={`${styles.subNavBtn} ${activeSection === s.id ? styles.subNavActive : ''}`}
            onClick={() => setSection(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── CONTACT & IDENTITY ── */}
      {activeSection === 'contact' && (
        <div className={styles.settingsBlock}>
          <h3 className={styles.sectionTitle}>Identity & Contact</h3>
          {inp('name',      'Boutique Name')}
          {inp('tagline',   'Tagline (shown in loader and hero)')}
          {inp('founded',   'Founded Year (e.g. 2018)')}
          {inp('location',  'City, State (e.g. Udaipur, Rajasthan)')}
          {inp('address',   'Full Address')}
          {inp('phone',     'Phone Number')}
          {inp('whatsapp',  'WhatsApp Number', { hint: 'No + or spaces — e.g. 919876543210' })}
          {inp('email',     'Email Address')}
          {inp('instagram', 'Instagram Handle', { hint: 'Without @ — e.g. kriyaboutique' })}
          {inp('instagramUrl', 'Instagram Full URL')}
          {inp('mapEmbed',  'Google Maps Embed URL', { hint: 'Paste the src URL from Google Maps → Share → Embed a map' })}
          <button className={styles.btnPrimary} onClick={saveBrand}>Save Contact Settings</button>
        </div>
      )}

      {/* ── TEXTS & CONTENT ── */}
      {activeSection === 'content' && (
        <div className={styles.settingsBlock}>
          <h3 className={styles.sectionTitle}>Website Texts</h3>
          {inp('about',      'About Text (main paragraph)', { textarea: true, rows: 4 })}
          {inp('aboutPara2', 'About Text (second paragraph)', { textarea: true, rows: 3 })}
          {inp('introText1', 'Intro / Philosophy (paragraph 1)', { textarea: true, rows: 3 })}
          {inp('introText2', 'Intro / Philosophy (paragraph 2)', { textarea: true, rows: 3 })}
          {inp('siteQuote',  'Pull Quote (shown in full-width quote section)', { textarea: true, rows: 2 })}
          {inp('marqueeText', 'Marquee Banner Items', { hint: 'Separate items with | e.g. Bridal Lehengas|Bespoke Couture|Udaipur Atelier' })}

          <h3 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Stats (About Section)</h3>
          {inp('statBrides', 'Brides Stat (e.g. 500+)')}
          {inp('statYears',  'Years Stat (e.g. 7+)')}
          {inp('statCraft',  'Craft Stat (e.g. 100%)')}

          <button className={styles.btnPrimary} onClick={saveBrand}>Save Content Settings</button>
        </div>
      )}

      {/* ── PROCESS STEPS ── */}
      {activeSection === 'process' && (
        <div className={styles.settingsBlock}>
          <h3 className={styles.sectionTitle}>Process Steps</h3>
          <p className={styles.helpText}>These appear in the "How we create" section on the homepage.</p>
          {(form.processSteps || []).map((step, i) => (
            <div key={i} className={styles.processStepCard}>
              <div className={styles.processStepHeader}>
                <span className={styles.processStepNum}>Step {i + 1}</span>
                <button className={styles.btnSmDanger} onClick={() => removeStep(i)}>Remove</button>
              </div>
              <div className={styles.processStepFields}>
                <div className={styles.field}>
                  <label className={styles.lbl}>Step Number (display)</label>
                  <input className={styles.inp} value={step.num || ''} onChange={e => setStep(i, 'num', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.lbl}>Icon (unicode symbol)</label>
                  <input className={styles.inp} value={step.icon || ''} onChange={e => setStep(i, 'icon', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.lbl}>Title</label>
                  <input className={styles.inp} value={step.title || ''} onChange={e => setStep(i, 'title', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.lbl}>Description</label>
                  <textarea className={styles.inp} rows={3} value={step.desc || ''} onChange={e => setStep(i, 'desc', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <div className={styles.formActions}>
            <button className={styles.btnGhost} onClick={addStep}>+ Add Step</button>
            <button className={styles.btnPrimary} onClick={saveBrand}>Save Process Steps</button>
          </div>
        </div>
      )}

      {/* ── HERO PHOTO ── */}
      {activeSection === 'hero' && (
        <div className={styles.settingsBlock}>
          <h3 className={styles.sectionTitle}>Hero Photo</h3>
          <p className={styles.helpText}>This is the large model photo shown on the homepage and About section.</p>
          {form.heroPhoto && (
            <img
              src={form.heroPhoto.startsWith('/uploads') ? `${BASE_URL}${form.heroPhoto}` : form.heroPhoto}
              alt="Hero" className={styles.heroPreview} />
          )}
          <div className={styles.field}>
            <label className={styles.lbl}>Upload New Hero Photo</label>
            <input type="file" ref={heroRef} accept="image/*" className={styles.fileInp} />
          </div>
          <button className={styles.btnPrimary} onClick={saveHero}>Upload Hero Photo</button>
        </div>
      )}
    </div>
  )
}

// ── INSTAGRAM TAB ─────────────────────────────────────
function InstaTab({ toast }) {
  const [posts, setPosts]   = useState([])
  const [form, setForm]     = useState({ caption:'', likes:'', url:'' })
  const [editing, setEdit]  = useState(null)
  const [confirm, setConfirm] = useState(null)
  const fileRef = useRef()

  useEffect(() => { load() }, [])
  const load = async () => {
    try { setPosts(await instaAPI.getAll()) } catch(e) { toast(e.message,'error') }
  }

  const save = async () => {
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k, v))
      const file = fileRef.current?.files?.[0]
      if (file) fd.append('photo', file)
      if (editing) await instaAPI.update(editing._id, fd)
      else         await instaAPI.create(fd)
      toast('Saved!','ok'); setForm({caption:'',likes:'',url:''}); setEdit(null); load()
    } catch(e) { toast(e.message,'error') }
  }

  const del = async (id) => {
    try { await instaAPI.delete(id); toast('Deleted','ok'); load() }
    catch(e) { toast(e.message,'error') }
    finally { setConfirm(null) }
  }

  return (
    <div>
      <div className={styles.tabHeader}><h2>Instagram Gallery <span className={styles.count}>{posts.length}</span></h2></div>
      <div className={styles.splitLayout}>
        <div>
          <h3 className={styles.sectionTitle}>{editing ? 'Edit Post' : 'Add Post'}</h3>
          <div className={styles.field}><label className={styles.lbl}>Photo</label>
            <input type="file" ref={fileRef} accept="image/*" className={styles.fileInp} /></div>
          <div className={styles.field}><label className={styles.lbl}>Caption</label>
            <input className={styles.inp} value={form.caption} onChange={e=>setForm(v=>({...v,caption:e.target.value}))} /></div>
          <div className={styles.field}><label className={styles.lbl}>Likes (e.g. 2.4k)</label>
            <input className={styles.inp} value={form.likes} onChange={e=>setForm(v=>({...v,likes:e.target.value}))} /></div>
          <div className={styles.formActions}>
            <button className={styles.btnPrimary} onClick={save}>Save</button>
            {editing && <button className={styles.btnGhost} onClick={()=>{setEdit(null);setForm({caption:'',likes:'',url:''})}}>Cancel</button>}
          </div>
        </div>
        <div className={styles.instaGrid}>
          {posts.map(p => (
            <div key={p._id} className={styles.instaThumb}>
              <img src={p.photo.startsWith('/uploads') ? `${BASE_URL}${p.photo}` : p.photo} alt="" />
              <div className={styles.instaActions}>
                <button className={styles.btnSm} onClick={()=>{setEdit(p);setForm(p)}}>Edit</button>
                <button className={styles.btnSmDanger} onClick={()=>setConfirm({msg:'Delete this post?',id:p._id})}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {confirm && <Confirm msg={confirm.msg} onYes={()=>del(confirm.id)} onNo={()=>setConfirm(null)} />}
    </div>
  )
}

// ── MAIN ADMIN APP ────────────────────────────────────
const TABS = [
  { id: 'dresses',    label: '👗 Dresses',      Component: DressesTab    },
  { id: 'categories', label: '🗂️ Collections',  Component: CategoriesTab },
  { id: 'testimonials',label:'💬 Reviews',      Component: TestimonialsTab},
  { id: 'insta',      label: '📸 Instagram',    Component: InstaTab      },
  { id: 'brand',      label: '⚙️ Settings',     Component: BrandTab      },
]

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState('dresses')
  const [toast, setToast] = useState({ msg:'', type:'' })

  useEffect(() => {
    authAPI.verify()
      .then(() => setLoggedIn(true))
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  const showToast = (msg, type='ok') => setToast({ msg, type })
  const logout = () => { localStorage.removeItem('kb_admin_token'); setLoggedIn(false) }

  if (checking) return <div className={styles.loadingFull}>Loading...</div>
  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

  const Active = TABS.find(t => t.id === activeTab)?.Component

  return (
    <div className={styles.admin}>
      <Cursor />
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({msg:'',type:''})} />

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>Kriya<br />Admin</div>
        <nav className={styles.sidebarNav}>
          {TABS.map(t => (
            <button key={t.id}
              className={`${styles.navItem} ${activeTab === t.id ? styles.navActive : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <button className={styles.seedBtn} onClick={async () => {
          try {
            const r = await fetch(`${(import.meta.env.VITE_API_URL||'http://localhost:5000/api')}/seed`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${localStorage.getItem('kb_admin_token')}` }
            })
            const d = await r.json()
            alert('Seed done! ' + JSON.stringify(d.results, null, 2))
          } catch(e) { alert('Seed failed: ' + e.message) }
        }}>🌱 Seed DB</button>
        <button className={styles.logoutBtn} onClick={logout}>Logout →</button>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {Active && <Active toast={showToast} />}
      </main>
    </div>
  )
}
