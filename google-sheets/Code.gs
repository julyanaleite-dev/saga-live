const SHEETS = {
  sessoes: 'sessoes',
  participantes: 'participantes',
  respostas: 'respostas',
  resumos: 'resumos',
  eventos: 'eventos'
};

const HEADERS = {
  sessoes: ['created_at', 'session_id', 'mode', 'started_at', 'slides_total', 'app'],
  participantes: ['created_at', 'session_id', 'name', 'role', 'school', 'joined_at'],
  respostas: ['created_at', 'session_id', 'slide_n', 'section', 'slide_title', 'participant', 'role', 'school', 'answer', 'correct', 'time_ms', 'score'],
  resumos: ['created_at', 'session_id', 'mode', 'slides_total', 'participants', 'responses', 'accuracy', 'avg_time_ms', 'finished_at'],
  eventos: ['created_at', 'session_id', 'action', 'payload']
};

function doGet() {
  ensureSheets_();
  return json_({ ok: true, app: 'saga-live' });
}

function doPost(e) {
  ensureSheets_();
  var payload = JSON.parse(e.postData.contents || '{}');
  var action = payload.action || 'event';
  var data = payload.data || {};

  if (action === 'session_start') {
    append_(SHEETS.sessoes, {
      created_at: new Date(),
      session_id: data.session_id,
      mode: data.mode,
      started_at: data.started_at,
      slides_total: data.slides_total,
      app: payload.app || 'saga-live'
    });
  } else if (action === 'participant_joined') {
    append_(SHEETS.participantes, {
      created_at: new Date(),
      session_id: data.session_id,
      name: data.name,
      role: data.role,
      school: data.school,
      joined_at: data.joined_at
    });
  } else if (action === 'answer_submitted') {
    append_(SHEETS.respostas, {
      created_at: new Date(),
      session_id: data.session_id,
      slide_n: data.slide_n,
      section: data.section,
      slide_title: data.slide_title,
      participant: data.participant,
      role: data.role,
      school: data.school,
      answer: data.answer,
      correct: data.correct,
      time_ms: data.time_ms,
      score: data.score
    });
  } else if (action === 'session_summary') {
    append_(SHEETS.resumos, {
      created_at: new Date(),
      session_id: data.session_id,
      mode: data.mode,
      slides_total: data.slides_total,
      participants: data.participants,
      responses: data.responses,
      accuracy: data.accuracy,
      avg_time_ms: data.avg_time_ms,
      finished_at: data.finished_at
    });
  } else {
    append_(SHEETS.eventos, {
      created_at: new Date(),
      session_id: data.session_id || '',
      action: action,
      payload: JSON.stringify(data)
    });
  }

  return json_({ ok: true, action: action });
}

function setup() {
  ensureSheets_();
}

function ensureSheets_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(HEADERS).forEach(function(sheetName) {
    var sh = ss.getSheetByName(sheetName);
    if (!sh) sh = ss.insertSheet(sheetName);
    var headers = HEADERS[sheetName];
    var firstRow = sh.getRange(1, 1, 1, headers.length).getValues()[0];
    var isEmpty = firstRow.every(function(v) { return !v; });
    if (isEmpty) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
  });
}

function append_(sheetName, obj) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(sheetName);
  var headers = HEADERS[sheetName];
  var row = headers.map(function(h) { return obj[h] !== undefined ? obj[h] : ''; });
  sh.appendRow(row);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
