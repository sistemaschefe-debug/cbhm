const AUTH_STORAGE_KEY = 'currentUser';
const ADMIN_CREDENTIALS = { admin: 'cbhm2026' };

function persistAuthUser(user){
  if(user){
    lsSet(AUTH_STORAGE_KEY, user);
  } else {
    lsSet(AUTH_STORAGE_KEY, null);
  }
}

function restoreAuthUser(){
  const user = lsGet(AUTH_STORAGE_KEY);
  if(user && user.id && user.profile) return user;
  return null;
}

function resolveLoginUser(email, password, users){
  const normalizedEmail = String(email || '').trim();
  const normalizedPassword = String(password || '');
  const userList = Array.isArray(users) ? users : [];

  const matchedUser = userList.find(user => {
    try {
      return String(user.email || '').trim() === normalizedEmail && atob(String(user.password || '')) === normalizedPassword;
    } catch {
      return false;
    }
  });

  if(matchedUser){
    return {
      id: matchedUser.id,
      email: matchedUser.email,
      warName: matchedUser.warName,
      profile: matchedUser.profile,
      source: 'users-db',
    };
  }

  if(ADMIN_CREDENTIALS.admin === normalizedPassword && normalizedEmail === 'admin'){
    return {
      id: 'admin',
      email: 'admin',
      warName: 'Administrador',
      profile: 'admin',
      source: 'fallback-admin',
    };
  }

  return null;
}

function hasUserAccess(user, feature){
  if(!user) return false;

  const featureAccessMap = {
    admin: ['dashboard', 'questions', 'teams', 'users', 'gemini', 'landing', 'session', 'scoreboard', 'live', 'results'],
    manager: ['dashboard', 'questions', 'teams', 'session', 'scoreboard'],
    teacher: ['questions', 'session', 'scoreboard'],
  };

  return (featureAccessMap[user.profile] || []).includes(feature);
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

window.CBHMAuth = {
  persistAuthUser,
  restoreAuthUser,
  resolveLoginUser,
  hasUserAccess,
  applyMenuAccessControl,
  checkUserAccess,
  ADMIN_CREDENTIALS,
};

window.persistAuthUser = persistAuthUser;
window.restoreAuthUser = restoreAuthUser;
window.resolveLoginUser = resolveLoginUser;
window.hasUserAccess = hasUserAccess;
window.applyMenuAccessControl = applyMenuAccessControl;
window.checkUserAccess = checkUserAccess;
