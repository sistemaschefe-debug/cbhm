const participantScannerState = {
  scanner: null,
  active: false,
};

function normalizeParticipantQrText(rawText) {
  const text = String(rawText ?? '').trim();
  if (!text) return null;

  try {
    const url = new URL(text, window.location.href);
    const code = url.searchParams.get('code');
    const pin = url.searchParams.get('pin');
    const participant = url.searchParams.get('participant');

    if (code || pin || participant) {
      return {
        code: code ? String(code).trim().toUpperCase() : '',
        pin: pin ? String(pin).trim() : '',
        participant: participant ? String(participant).trim() : '',
        rawText: text,
        source: 'url',
      };
    }
  } catch (error) {
    // Not a URL, try other formats below.
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed && (parsed.code || parsed.pin)) {
      return {
        code: parsed.code ? String(parsed.code).trim().toUpperCase() : '',
        pin: parsed.pin ? String(parsed.pin).trim() : '',
        participant: parsed.participant ? String(parsed.participant).trim() : '',
        rawText: text,
        source: 'json',
      };
    }
  } catch (error) {
    // Not JSON.
  }

  const compactMatch = text.match(/^([A-Z0-9_-]{3,})\s*[|;,:/\\-]\s*([0-9]{4,8})$/i);
  if (compactMatch) {
    return {
      code: compactMatch[1].trim().toUpperCase(),
      pin: compactMatch[2].trim(),
      participant: '',
      rawText: text,
      source: 'compact',
    };
  }

  const looseMatch = text.match(/(?:code\s*[:=]\s*)?([A-Z0-9_-]{3,}).*?(?:pin\s*[:=]\s*)?([0-9]{4,8})/i);
  if (looseMatch) {
    return {
      code: looseMatch[1].trim().toUpperCase(),
      pin: looseMatch[2].trim(),
      participant: '',
      rawText: text,
      source: 'loose',
    };
  }

  return null;
}

function fillParticipantJoinForm(payload) {
  if (!payload) return false;

  const codeInput = document.getElementById('participantCodeInput');
  const pinInput = document.getElementById('participantPinInput');

  if (codeInput && payload.code) codeInput.value = payload.code;
  if (pinInput && payload.pin) pinInput.value = payload.pin;

  return Boolean((payload.code && codeInput) || (payload.pin && pinInput));
}

function debugParticipantPinSession({ inputPin, sessionPin, code, activeSessionActive, qrPayload }) {
  const normalizedInputPin = String(inputPin ?? '').trim();
  const normalizedSessionPin = String(sessionPin ?? '').trim();
  const normalizedCode = String(code ?? '').trim().toUpperCase();

  return {
    inputPin: normalizedInputPin,
    sessionPin: normalizedSessionPin,
    code: normalizedCode,
    activeSessionActive: Boolean(activeSessionActive),
    match: normalizedInputPin === normalizedSessionPin,
    qrPayload: qrPayload || null,
  };
}

async function closeParticipantScanner() {
  const modal = document.getElementById('participantQrScannerModal');
  const mount = document.getElementById('participantQrScannerMount');

  participantScannerState.active = false;

  if (modal) modal.classList.add('hidden');

  if (participantScannerState.scanner) {
    try {
      await participantScannerState.scanner.clear();
    } catch (error) {
      console.debug('[QR DEBUG] Scanner clear falhou:', error);
    }
    participantScannerState.scanner = null;
  }

  if (mount) mount.innerHTML = '';
}

async function openParticipantScanner() {
  const modal = document.getElementById('participantQrScannerModal');
  const mount = document.getElementById('participantQrScannerMount');

  if (!modal || !mount) {
    window.toast?.('Scanner indisponível nesta tela', 'err');
    return;
  }

  modal.classList.remove('hidden');
  mount.innerHTML = '<div style="padding:1rem;color:var(--muted);font-family:var(--fh)">Preparando câmera...</div>';

  if (!window.Html5QrcodeScanner) {
    mount.innerHTML = '<div style="padding:1rem;color:var(--muted);font-family:var(--fh)">Biblioteca de scanner não carregou. Verifique a conexão com a internet.</div>';
    return;
  }

  if (participantScannerState.scanner) {
    await closeParticipantScanner();
    modal.classList.remove('hidden');
  }

  mount.innerHTML = '';
  participantScannerState.active = true;
  participantScannerState.scanner = new Html5QrcodeScanner(
    'participantQrScannerMount',
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    },
    false
  );

  participantScannerState.scanner.render(async (decodedText) => {
    if (!participantScannerState.active) return;

    const parsed = normalizeParticipantQrText(decodedText);
    console.debug('[QR DEBUG]', { decodedText, parsed });

    if (parsed) {
      fillParticipantJoinForm(parsed);
      window.toast?.('QR code lido com sucesso', 'ok');
    } else {
      window.toast?.('QR code lido, mas formato não reconhecido', 'err');
    }

    await closeParticipantScanner();
  }, (error) => {
    if (participantScannerState.active) {
      console.debug('[QR DEBUG] leitura em andamento:', error);
    }
  });
}

window.CBHMParticipantTools = {
  normalizeParticipantQrText,
  fillParticipantJoinForm,
  debugParticipantPinSession,
  parseParticipantQrText: normalizeParticipantQrText,
  openParticipantScanner,
  closeParticipantScanner,
};

window.normalizeParticipantQrText = normalizeParticipantQrText;
window.parseParticipantQrText = normalizeParticipantQrText;
window.fillParticipantJoinForm = fillParticipantJoinForm;
window.debugParticipantPinSession = debugParticipantPinSession;
window.openParticipantScanner = openParticipantScanner;
window.closeParticipantScanner = closeParticipantScanner;
