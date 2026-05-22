const DB_PREFIX = 'cbhm_';
const DB_CHANNELS = {};

function lsGet(key){
  try {
    return JSON.parse(localStorage.getItem(DB_PREFIX + key)) || null;
  } catch {
    return null;
  }
}

function lsSet(key, value){
  localStorage.setItem(DB_PREFIX + key, JSON.stringify(value));
}

function esc(value = ''){
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeLandingConfig(cfg = {}){
  const fallback = {
    subtitle: 'Campeonato Brasileiro de História Militar',
    title: 'Campeonato Brasileiro de História Militar',
    year: '2026',
    location: 'AMAN — Resende, Rio de Janeiro',
    schools: ['AMAN','EPCAr','EsPCEx','CN','AFA','EN','EsSA','APMBB'],
    logoUrl: ''
  };

  const schools = Array.isArray(cfg.schools) ? cfg.schools.filter(Boolean) : [];
  return {
    subtitle: cfg.subtitle || fallback.subtitle,
    title: cfg.title || fallback.title,
    year: cfg.year || fallback.year,
    location: cfg.location || fallback.location,
    schools: schools.length ? schools : [],
    logoUrl: cfg.logoUrl || ''
  };
}

function sb(){
  return Boolean(window._sbReady && window._sb);
}

function _lsKey(path){
  return String(path).replace(/\//g, '__');
}

async function dbGet(path){
  if(!sb()) return lsGet(_lsKey(path));
  try {
    const parts = String(path).split('/');
    const { data, error } = await window._sb.from('kv').select('value').eq('key', parts[0]).maybeSingle();
    if(error || !data) return null;
    let val = data.value;
    for(let i = 1; i < parts.length; i++){
      if(val == null) return null;
      val = val[parts[i]];
    }
    return val ?? null;
  } catch (error) {
    console.warn('dbGet erro:', path, error);
    return lsGet(_lsKey(path));
  }
}

async function dbSet(path, value){
  if(!sb()){
    lsSet(_lsKey(path), value);
    return;
  }
  try {
    const parts = String(path).split('/');
    const rootKey = parts[0];
    if(parts.length === 1){
      await window._sb.from('kv').upsert({ key: rootKey, value }, { onConflict: 'key' });
      return;
    }

    const { data } = await window._sb.from('kv').select('value').eq('key', rootKey).maybeSingle();
    const root = data?.value ?? {};
    let cur = root;
    for(let i = 1; i < parts.length - 1; i++){
      if(!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    await window._sb.from('kv').upsert({ key: rootKey, value: root }, { onConflict: 'key' });
  } catch (error) {
    console.warn('dbSet erro:', path, error);
    lsSet(_lsKey(path), value);
  }
}

async function dbUpdate(path, updates){
  if(!sb()){
    const current = lsGet(_lsKey(path)) || {};
    lsSet(_lsKey(path), { ...current, ...updates });
    return;
  }

  try {
    const parts = String(path).split('/');
    const rootKey = parts[0];
    const { data } = await window._sb.from('kv').select('value').eq('key', rootKey).maybeSingle();
    let root = data?.value ?? {};

    if(parts.length === 1){
      root = { ...root, ...updates };
    } else {
      let cur = root;
      for(let i = 1; i < parts.length - 1; i++){
        if(!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      const last = parts[parts.length - 1];
      cur[last] = { ...(cur[last] || {}), ...updates };
    }

    await window._sb.from('kv').upsert({ key: rootKey, value: root }, { onConflict: 'key' });
  } catch (error) {
    console.warn('dbUpdate erro:', path, error);
    const current = lsGet(_lsKey(path)) || {};
    lsSet(_lsKey(path), { ...current, ...updates });
  }
}

async function dbPush(path, data){
  const id = 'id' + Date.now() + Math.random().toString(36).slice(2, 6);
  const item = { ...data, id };

  if(!sb()){
    const arr = lsGet(_lsKey(path)) || [];
    arr.push(item);
    lsSet(_lsKey(path), arr);
    return id;
  }

  try {
    const { data: existing } = await window._sb.from('kv').select('value').eq('key', _lsKey(path)).maybeSingle();
    const arr = existing?.value ? (Array.isArray(existing.value) ? existing.value : Object.values(existing.value)) : [];
    arr.push(item);
    await window._sb.from('kv').upsert({ key: _lsKey(path), value: arr }, { onConflict: 'key' });
    return id;
  } catch (error) {
    console.warn('dbPush erro:', path, error);
    const arr = lsGet(_lsKey(path)) || [];
    arr.push(item);
    lsSet(_lsKey(path), arr);
    return id;
  }
}

function dbListen(path, cb){
  dbGet(path).then(value => cb(value));

  if(!sb()) return;

  const rootKey = String(path).split('/')[0];
  const channelName = 'kv-' + rootKey;
  if(DB_CHANNELS[channelName]) return;

  DB_CHANNELS[channelName] = window._sb
    .channel(channelName)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'kv', filter: `key=eq.${rootKey}`
    }, async () => {
      cb(await dbGet(path));
    })
    .subscribe(status => {
      if(status === 'SUBSCRIBED'){
        console.log('🔴 Realtime ativo:', channelName);
        if(DB_CHANNELS[channelName + '_poll']){
          clearInterval(DB_CHANNELS[channelName + '_poll']);
          delete DB_CHANNELS[channelName + '_poll'];
        }
      } else if(status === 'CHANNEL_ERROR' || status === 'TIMED_OUT'){
        if(!DB_CHANNELS[channelName + '_poll']){
          console.warn('Realtime indisponível, polling 2s para:', path);
          DB_CHANNELS[channelName + '_poll'] = setInterval(async () => cb(await dbGet(path)), 2000);
        }
      }
    });
}

window.lsGet = lsGet;
window.lsSet = lsSet;
window.esc = esc;
window.normalizeLandingConfig = normalizeLandingConfig;
window.sb = sb;
window.dbGet = dbGet;
window.dbSet = dbSet;
window.dbUpdate = dbUpdate;
window.dbPush = dbPush;
window.dbListen = dbListen;
