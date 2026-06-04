const AUTH_STORAGE_KEY = 'currentUser';
const ADMIN_CREDENTIALS = { admin: 'cbhm2026' };
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 horas (aumentado de 15 minutos para resolver problema de logout)

function normalizeProfile(profile){
  const value = String(profile || '').trim().toLowerCase();
  const aliases = {
    admin: 'admin',
    administrador: 'admin',
    'administrador (acesso total)': 'admin',
    manager: 'manager',
    gerente: 'manager',
    teacher: 'teacher',
    professor: 'teacher',
  };
  const normalized = aliases[value] || value;
  // Se ainda for vazio após normalização, retornar 'teacher' como padrão
  return normalized || 'teacher';
}

function persistAuthUser(user){
  if(user){
    lsSet(AUTH_STORAGE_KEY, { ...user, loggedAt: Date.now() });
  } else {
    lsSet(AUTH_STORAGE_KEY, null);
  }
}

function restoreAuthUser(){
  const user = lsGet(AUTH_STORAGE_KEY);
  if(!user || !user.id || !(user.profile || user.role || user.perfil)) return null;
  if(user.loggedAt && Date.now() - user.loggedAt > SESSION_DURATION){
    lsSet(AUTH_STORAGE_KEY, null);
    return null;
  }
  return user;
}

function resolveLoginUser(email, password, users){
  const normalizedEmail = String(email || '').trim();
  const normalizedPassword = String(password || '');
  const userList = Array.isArray(users) ? users : [];

  const matchedUser = userList.find(user => {
    const storedPassword = String(user.password || '');
    let decodedPassword = '';
    try {
      decodedPassword = atob(storedPassword);
    } catch {
      decodedPassword = storedPassword;
    }

    return String(user.email || '').trim() === normalizedEmail && (
      decodedPassword === normalizedPassword || storedPassword === normalizedPassword
    );
  });

   if(matchedUser){
     return {
       id: matchedUser.id,
       email: matchedUser.email,
       warName: matchedUser.warName,
       rank: matchedUser.rank || '',
       icon: matchedUser.icon || '',
       profile: normalizeProfile(matchedUser.profile || matchedUser.role || matchedUser.perfil || matchedUser.access || matchedUser.type),
       source: 'users-db',
     };
   }

   if(ADMIN_CREDENTIALS.admin === normalizedPassword && normalizedEmail === 'admin'){
     return {
       id: 'admin',
       email: 'admin',
       warName: 'Administrador',
       rank: '',
       icon: '',
       profile: 'admin',
       source: 'fallback-admin',
     };
   }

  return null;
}

function hasUserAccess(userOrFeature, feature){
  // Suporta ambos: hasUserAccess(feature) ou hasUserAccess(user, feature)
  let user;
  if(feature === undefined){
    user = currentUser;
    feature = userOrFeature;
  } else {
    user = userOrFeature;
  }

  if(!user) return false;

  const profile = normalizeProfile(user.profile || user.role || user.perfil || user.access || user.type);

  const featureAccessMap = {
    admin: ['dashboard', 'questions', 'teams', 'users', 'gemini', 'landing', 'session', 'scoreboard', 'live', 'results', 'sistema'],
    manager: ['dashboard', 'questions', 'teams', 'session', 'scoreboard'],
    teacher: ['questions', 'session', 'scoreboard'],
  };

  return (featureAccessMap[profile] || []).includes(feature);
}

function applyMenuAccessControl(user){
  if(!user) return;

  const menuItemMap = {
    tabDashboard: 'dashboard',
    tabQuestions: 'questions',
    tabGemini: 'gemini',
    tabTeams: 'teams',
    tabUsers: 'users',
    tabLanding: 'landing',
    tabSession: 'session',
    tabScoreboard: 'scoreboard',
    tabSistema: 'sistema',
  };

  Object.entries(menuItemMap).forEach(([tab, feature]) => {
    const el = document.querySelector(`[onclick*="${tab}"]`);
    if(!el) return;
    el.style.display = hasUserAccess(user, feature) ? '' : 'none';
  });
}

function checkUserAccess(user, feature){
  return hasUserAccess(user, feature);
}

window.normalizeProfile = normalizeProfile;

window.CBHMAuth = {
  persistAuthUser,
  restoreAuthUser,
  resolveLoginUser,
  hasUserAccess,
  applyMenuAccessControl,
  checkUserAccess,
  normalizeProfile,
  ADMIN_CREDENTIALS,
  SESSION_DURATION,
};

window.persistAuthUser = persistAuthUser;
window.restoreAuthUser = restoreAuthUser;
window.resolveLoginUser = resolveLoginUser;
window.hasUserAccess = hasUserAccess;
window.applyMenuAccessControl = applyMenuAccessControl;
window.checkUserAccess = checkUserAccess;
window.SESSION_DURATION = SESSION_DURATION;
