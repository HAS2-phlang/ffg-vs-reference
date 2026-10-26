/**
 * HackathonApply.gs
 * Foundry for Good Social Good Hackathon: the apply form posts here (Oct 26 2026).
 * Built the same way as the Pitch Forum's collect.gs.
 *
 * Every application:
 *   1. is saved as one row in the Sheet (setup() makes the Sheet for you),
 *   2. emails Hugh a branded notification with every answer and a link to the row,
 *   3. emails the applicant a branded copy of what they sent (SEND_APPLICANT_COPY).
 *
 * One-time setup (about 3 minutes):
 *   1. script.google.com > New project. Paste this whole file over the starter code. Save.
 *   2. Pick "setup" in the function menu at the top, press Run, and allow the permissions.
 *      It creates the private Sheet in your Drive and emails you its link.
 *   3. Deploy > New deployment > type: Web app. Execute as: Me. Who has access: Anyone. Deploy.
 *   4. Copy the Web app URL (ends in /exec) and send it to Claude, who puts it in the site.
 *   Test: open the /exec URL in a browser. It should say "ok": true.
 *
 * Changing this file later (keeps the same /exec link):
 *   Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 *
 * ES5 only (var, function declarations, string concatenation), like collect.gs.
 * doPost never throws: the form always gets a JSON answer.
 */

/* ---------- 1. Settings ---------- */

var NOTIFY = 'hugh.sasil@foundryforgood.com';          // fixed here, so the page can't send anywhere else
var SHEET_NAME = 'Social Good Hackathon applications 2027';
var TAB = 'Applications';
var REF_PREFIX = 'SGH-2027-';                            // SGH-2027-0001, SGH-2027-0002, ...
var SEND_APPLICANT_COPY = true;                          // false = only Hugh gets an email
var TZ = 'Asia/Manila';
var EVENT_LINE = 'Saturday, January 23, 2027 · Makati';

var HEADERS = ['Submitted (Manila)', 'Reference', 'Applying as', 'First name', 'Last name', 'Email', 'LinkedIn',
  'Team name', 'Team size',
  'Teammate 2 first', 'Teammate 2 last', 'Teammate 2 email', 'Teammate 2 LinkedIn',
  'Teammate 3 first', 'Teammate 3 last', 'Teammate 3 email', 'Teammate 3 LinkedIn',
  'Teammate 4 first', 'Teammate 4 last', 'Teammate 4 email', 'Teammate 4 LinkedIn',
  'Why join', 'Idea', 'Their idea', 'Privacy consent', 'Page', 'Browser'];

// Pinned public images (same repo as the site), so the emails never break.
var IMG = 'https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/fcccf6a3abcb1e770620b049cff7114e7de6219c/public/';
var EMAIL_LOGO = IMG + 'pitchforum/img/logo-cream.png';
var EMAIL_MARK = IMG + 'assets/ffg-mark.png';
var EMAIL_HERO = 'https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/47cd34992611ec5024f3976354634767c7c4d82c/social-good-hackathon/assets/apply-group-2026.jpg';
var F = 'font-family:Arial,Helvetica,sans-serif;';

/* ---------- 2. Web app entry points ---------- */

function doPost(e) {
  try {
    var p = readPayload_(e);
    if (!p) return out_({ ok: false, error: 'no_payload' });
    if (String(p.website_url_2 || '').length > 0) return out_({ ok: false, error: 'dropped' });   // honeypot: bots only
    var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if (!id) return out_({ ok: false, error: 'not_set_up', hint: 'Run setup() once in the Apps Script editor.' });
    var a = normalise_(p);
    if (!a.first || !a.email) return out_({ ok: false, error: 'missing_fields' });

    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    var ss, sh, ref, rowNumber;
    try {
      ss = SpreadsheetApp.openById(id);
      sh = getTab_(ss);
      ref = REF_PREFIX + pad4_(Math.max(1, sh.getLastRow()));
      sh.appendRow(row_(a, ref));
      rowNumber = sh.getLastRow();
    } finally {
      lock.releaseLock();
    }

    // The row is saved. Neither email may take the application down with it.
    var link = rowLink_(ss, sh, rowNumber);
    var mailedHugh = send_(NOTIFY, hughSubject_(a, ref), hughText_(a, ref, link), hughHtml_(a, ref, link), a.email);
    var mailedApplicant = false;
    if (SEND_APPLICANT_COPY && validEmail_(a.email)) {
      mailedApplicant = send_(a.email, 'Your Social Good Hackathon application', applicantText_(a, ref), applicantHtml_(a, ref), NOTIFY);
    }
    return out_({ ok: true, id: ref, mailed_notify: mailedHugh, mailed_applicant: mailedApplicant });
  } catch (err) {
    return out_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doGet() {
  return out_({ ok: true, service: 'social-good-hackathon-apply',
    sheet_ready: !!PropertiesService.getScriptProperties().getProperty('SHEET_ID'), time: new Date().toISOString() });
}

/* Run ONCE from the editor: makes the private Sheet, remembers it, writes the header row, emails Hugh the link.
   Running it again is safe: it reuses the same Sheet. */
function setup() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create(SHEET_NAME); props.setProperty('SHEET_ID', ss.getId()); }
  var sh = getTab_(ss);
  var first = ss.getSheets()[0];
  if (first.getName() !== TAB && first.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(first);
  MailApp.sendEmail(NOTIFY, 'Hackathon applications Sheet is ready',
    'Applications from the Social Good Hackathon site will land here:\n' + ss.getUrl() + '\n\nNext: Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).');
  Logger.log('Sheet: ' + ss.getUrl());
  return ss.getUrl();
}

/* Sends a fake application through the whole flow (row + both emails) so you can see them. Delete the test row after. */
function testApplication() {
  var e = { parameter: { payload: JSON.stringify({
    applying_as: 'team', first: 'Test', last: 'Applicant', email: NOTIFY, linkedin: 'https://www.linkedin.com/in/example',
    team_name: 'Test Team', team_size: '3',
    teammates: [{ first: 'Ana', last: 'Cruz', email: 'ana@example.com', linkedin: 'https://www.linkedin.com/in/ana' },
                { first: 'Ben', last: 'Reyes', email: 'ben@example.com', linkedin: 'none' }],
    why: 'This is a test application from testApplication().', idea: 'own', ideatext: 'A test idea.', privacy: true,
    page: 'testApplication()', user_agent: 'Apps Script' }) } };
  Logger.log(doPost(e).getContent());
}

/* ---------- 3. Reading and storing ---------- */

function readPayload_(e) {
  var raw = (e && e.parameter && e.parameter.payload) ? String(e.parameter.payload)
          : (e && e.postData && e.postData.contents) ? String(e.postData.contents) : '';
  if (!raw) return null;
  try { var o = JSON.parse(raw); return (o && typeof o === 'object') ? o : null; } catch (err) { return null; }
}

function t_(v, max) { return String(v === null || v === undefined ? '' : v).trim().slice(0, max || 500); }

function normalise_(p) {
  var team = String(p.applying_as) === 'team';
  var size = team ? Math.min(4, Math.max(3, parseInt(p.team_size, 10) || 3)) : 1;
  var mates = [];
  var raw = (p.teammates && p.teammates.length) ? p.teammates : [];
  for (var i = 0; team && i < size - 1 && i < 3; i++) {
    var m = raw[i] || {};
    mates.push({ first: t_(m.first, 80), last: t_(m.last, 80), email: t_(m.email, 254), linkedin: t_(m.linkedin, 300) });
  }
  return {
    team: team, size: size, mates: mates,
    first: t_(p.first, 80), last: t_(p.last, 80), email: t_(p.email, 254), linkedin: t_(p.linkedin, 300),
    teamName: team ? t_(p.team_name, 120) : '',
    why: t_(p.why, 4000), ideaOwn: String(p.idea) === 'own', ideaText: String(p.idea) === 'own' ? t_(p.ideatext, 4000) : '',
    privacy: p.privacy === true || p.privacy === 'true' || p.privacy === 'on',
    page: t_(p.page, 300), ua: t_(p.user_agent, 300),
    when: Utilities.formatDate(new Date(), TZ, "EEE, MMM d, yyyy 'at' h:mm a")
  };
}

function row_(a, ref) {
  var r = [Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm'), ref, a.team ? 'Team' : 'Individual',
    a.first, a.last, a.email, a.linkedin, a.teamName, a.team ? a.size : ''];
  for (var i = 0; i < 3; i++) {
    var m = a.mates[i];
    r.push(m ? m.first : '', m ? m.last : '', m ? m.email : '', m ? m.linkedin : '');
  }
  r.push(a.why, a.ideaOwn ? 'Their own idea' : 'Give me one of yours', a.ideaText, a.privacy ? 'Yes' : 'No', a.page, a.ua);
  // A leading = + - @ would be read as a formula, so prefix it with an apostrophe.
  return r.map(function (v) { var s = String(v); return /^[=+\-@]/.test(s) ? "'" + s : v; });
}

function getTab_(ss) {
  var sh = ss.getSheetByName(TAB) || ss.insertSheet(TAB);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#16323E').setFontColor('#F7F4EE');
  }
  return sh;
}

function rowLink_(ss, sh, n) {
  try { return ss.getUrl() + '#gid=' + sh.getSheetId() + '&range=A' + n; } catch (e) { return ss.getUrl(); }
}
function pad4_(n) { var s = String(n); while (s.length < 4) s = '0' + s; return s; }
function validEmail_(v) { return v.length <= 254 && /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(v); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function send_(to, subject, body, html, replyTo) {
  try {
    var msg = { to: to, subject: subject, body: body, htmlBody: html, name: 'Social Good Hackathon' };
    if (replyTo && validEmail_(replyTo)) msg.replyTo = replyTo;
    MailApp.sendEmail(msg);
    return true;
  } catch (err) { return false; }
}

/* ---------- 4. Email building blocks (Pitch Forum design) ---------- */

function esc_(v) {
  return String(v === null || v === undefined ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function val_(v) {
  var s = String(v || '').trim();
  if (!s) return '<span style="color:#6B6B6B">None</span>';
  if (/^https?:\/\//i.test(s)) return '<a href="' + esc_(s) + '" style="color:#B5502D">' + esc_(s) + '</a>';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return '<a href="mailto:' + esc_(s) + '" style="color:#B5502D">' + esc_(s) + '</a>';
  return esc_(s).replace(/\n/g, '<br>');
}
function open_(title) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' + esc_(title) + '</title></head>'
    + '<body style="margin:0;padding:0;background:#F7F4EE"><table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4EE"><tr><td align="center" style="padding:28px 12px">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #E6E0D6">';
}
function header_(label) {
  return '<tr><td style="background:#16323E;padding:20px 32px"><table width="100%" cellpadding="0" cellspacing="0"><tr>'
    + '<td><img src="' + EMAIL_LOGO + '" width="150" height="55" alt="Foundry for Good" style="display:block;width:150px;height:55px;border:0"></td>'
    + '<td align="right" style="' + F + 'font-size:12px;color:#F7F4EE;letter-spacing:.16em;text-transform:uppercase;vertical-align:middle">' + esc_(label) + '</td>'
    + '</tr></table></td></tr>';
}
function footer_(right) {
  return '<tr><td style="background:#16323E;padding:18px 32px"><table width="100%" cellpadding="0" cellspacing="0"><tr>'
    + '<td><img src="' + EMAIL_LOGO + '" width="110" height="40" alt="Foundry for Good" style="display:block;width:110px;height:40px;border:0"></td>'
    + '<td align="right" style="' + F + 'font-size:12px;color:#F7F4EE">' + right + '</td></tr></table></td></tr></table></td></tr></table></body></html>';
}
function chip_(label, value) {
  return '<span style="' + F + 'display:inline-block;background:#F7F4EE;border:1px solid #E6E0D6;color:#16323E;font-size:13px;padding:6px 12px;letter-spacing:.06em;margin:0 6px 6px 0">'
    + esc_(label) + '&nbsp; <b>' + esc_(value) + '</b></span>';
}
function row2_(label, html) {
  return '<tr><td style="' + F + 'padding:10px 14px 10px 0;border-top:1px solid #E6E0D6;color:#6B6B6B;font-size:13px;line-height:18px;width:38%;vertical-align:top">' + esc_(label) + '</td>'
    + '<td style="' + F + 'padding:10px 0;border-top:1px solid #E6E0D6;color:#1B1B1B;font-size:14px;line-height:20px;vertical-align:top">' + html + '</td></tr>';
}
function group_(n, title, rows) {
  return '<tr><td style="padding:24px 32px 0"><table width="100%" cellpadding="0" cellspacing="0">'
    + '<tr><td style="padding:0 0 8px"><table cellpadding="0" cellspacing="0"><tr>'
    + '<td style="' + F + 'background:#16323E;color:#ffffff;font-size:12px;font-weight:bold;padding:4px 9px;letter-spacing:.06em">' + esc_(n) + '</td>'
    + '<td style="' + F + 'font-size:18px;font-weight:bold;color:#16323E;padding-left:10px">' + esc_(title) + '</td></tr></table></td></tr>'
    + '<tr><td><table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #E6E0D6">' + rows + '</table></td></tr></table></td></tr>';
}
function name_(a) { return (a.first + ' ' + a.last).trim(); }

// Every answer, grouped the way the form asks them.
function answers_(a) {
  var h = '';
  var you = row2_('Applying as', a.team ? 'A team' : 'An individual')
    + row2_('Name', esc_(name_(a))) + row2_('Email', val_(a.email)) + row2_('LinkedIn', val_(a.linkedin));
  h += group_('1', a.team ? 'Applicant (teammate 1)' : 'Applicant', you);
  if (a.team) {
    var t = row2_('Team name', val_(a.teamName)) + row2_('Team size', esc_(a.size) + ' people, including the applicant');
    for (var i = 0; i < a.mates.length; i++) {
      var m = a.mates[i];
      t += row2_('Teammate ' + (i + 2), '<b>' + esc_((m.first + ' ' + m.last).trim() || 'No name') + '</b><br>'
        + val_(m.email) + '<br>' + val_(m.linkedin));
    }
    h += group_('2', 'Team', t);
  }
  var q = row2_('Why they want to join', val_(a.why))
    + row2_('Idea', a.ideaOwn ? 'Bringing their own idea' : 'Wants one of our ideas');
  if (a.ideaOwn) q += row2_('Their idea', val_(a.ideaText));
  h += group_(a.team ? '3' : '2', 'Their answers', q);
  return h;
}

/* ---------- 5. Hugh's email ---------- */

function hughSubject_(a, ref) {
  return 'Hackathon application: ' + (name_(a) || 'No name') + (a.team ? ' (team ' + (a.teamName || 'unnamed') + ', ' + a.size + ' people)' : ' (individual)') + ' ' + ref;
}

function hughHtml_(a, ref, link) {
  var h = open_(hughSubject_(a, ref)) + header_('New application');
  h += '<tr><td style="padding:34px 32px 0">'
    + '<div style="' + F + 'font-size:26px;line-height:32px;font-weight:bold;color:#16323E">' + esc_(name_(a) || 'Someone')
    + (a.team ? ' applied with a team of ' + a.size + '.' : ' applied as an individual.') + '</div>'
    + '<div style="' + F + 'font-size:14px;line-height:21px;color:#6B6B6B;margin-top:8px">' + esc_(a.when) + ' (Manila)</div>'
    + '<div style="margin-top:14px">' + chip_('Reference', ref) + chip_('Applying as', a.team ? 'Team' : 'Individual')
    + (a.team ? chip_('Team', a.teamName || 'Unnamed') : '') + chip_('Idea', a.ideaOwn ? 'Their own' : 'One of ours') + '</div>'
    + '<table cellpadding="0" cellspacing="0" style="margin-top:18px"><tr>'
    + '<td style="background:#B5502D;padding:12px 20px"><a href="' + esc_(link) + '" style="' + F + 'font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none">Open their row in the Sheet &rarr;</a></td>'
    + (a.linkedin && /^https?:\/\//i.test(a.linkedin) ? '<td style="width:10px"></td><td style="border:1px solid #16323E;padding:11px 18px"><a href="' + esc_(a.linkedin) + '" style="' + F + 'font-size:14px;font-weight:bold;color:#16323E;text-decoration:none">Their LinkedIn</a></td>' : '')
    + '</tr></table>'
    + '<p style="' + F + 'font-size:13px;line-height:20px;color:#6B6B6B;margin:14px 0 0">Reply to this email to write to ' + esc_(a.first || 'them') + ' directly.</p>'
    + '</td></tr>';
  h += answers_(a);
  h += '<tr><td style="padding:24px 32px 30px"><p style="' + F + 'font-size:12px;line-height:18px;color:#6B6B6B;margin:0">Privacy consent: '
    + (a.privacy ? 'yes' : 'no') + (SEND_APPLICANT_COPY ? ' &nbsp;&middot;&nbsp; The applicant was sent a copy of their answers.' : '') + '</p></td></tr>';
  h += footer_('Social Good Hackathon applications');
  return h;
}

function hughText_(a, ref, link) {
  var L = [name_(a) + (a.team ? ' applied with a team of ' + a.size + ' (' + (a.teamName || 'unnamed') + ').' : ' applied as an individual.'),
    'Reference ' + ref + ' · ' + a.when + ' (Manila)', '', 'Email: ' + a.email, 'LinkedIn: ' + (a.linkedin || 'None')];
  for (var i = 0; i < a.mates.length; i++) {
    var m = a.mates[i];
    L.push('Teammate ' + (i + 2) + ': ' + (m.first + ' ' + m.last).trim() + ', ' + m.email + ', ' + (m.linkedin || 'None'));
  }
  L.push('', 'Why they want to join: ' + (a.why || 'None'), 'Idea: ' + (a.ideaOwn ? 'Their own: ' + (a.ideaText || 'None') : 'One of ours'),
    '', 'Their row in the Sheet: ' + link);
  return L.join('\n');
}

/* ---------- 6. The applicant's copy ---------- */

function applicantHtml_(a, ref) {
  var h = open_('Your Social Good Hackathon application') + header_('Social Good Hackathon');
  h += '<tr><td style="background:#16323E"><img src="' + EMAIL_HERO + '" width="600" alt="The Foundry for Good team at the 2026 retreat" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>';
  h += '<tr><td style="padding:34px 32px 0"><table cellpadding="0" cellspacing="0"><tr>'
    + '<td style="vertical-align:top;padding-right:16px"><img src="' + EMAIL_MARK + '" width="52" height="52" alt="" style="display:block;width:52px;height:52px;border:0"></td>'
    + '<td style="vertical-align:top"><div style="' + F + 'font-size:27px;line-height:32px;font-weight:bold;color:#16323E">Your application is in.</div>'
    + '<div style="margin-top:12px">' + chip_('Reference', ref) + '</div></td></tr></table>'
    + '<p style="' + F + 'font-size:15px;line-height:23px;color:#1B1B1B;margin:22px 0 0">Thanks, ' + esc_(a.first || 'there') + '. '
    + (a.team ? 'Your team application for ' + esc_(a.teamName || 'your team') + ' is in. ' : 'Your application is in. ')
    + 'We\'ll be in touch once we\'ve read it. This email is your copy of what you sent us.</p>'
    + '<p style="' + F + 'font-size:15px;line-height:23px;color:#1B1B1B;margin:14px 0 0"><b>The Social Good Hackathon</b><br>' + esc_(EVENT_LINE) + '</p>'
    + '</td></tr>';
  h += answers_(a).replace(/>Their answers</g, '>Your answers<').replace(/Why they want to join/g, 'Why you want to join')
    .replace(/>Bringing their own idea</g, '>Bringing your own idea<').replace(/>Wants one of our ideas</g, '>One of our ideas<')
    .replace(/>Their idea</g, '>Your idea<').replace(/including the applicant/g, 'including you')
    .replace(/Applicant \(teammate 1\)/g, 'You (teammate 1)').replace(/>Applicant</g, '>You<');
  h += '<tr><td style="padding:24px 32px 30px"><p style="' + F + 'font-size:13px;line-height:20px;color:#6B6B6B;margin:0">Questions, or need to change something? Reply to this email or write to '
    + '<a href="mailto:' + NOTIFY + '" style="color:#B5502D">' + NOTIFY + '</a> and quote your reference.</p></td></tr>';
  h += footer_('<a href="https://foundryforgood.com" style="color:#F7F4EE">foundryforgood.com</a>');
  return h;
}

function applicantText_(a, ref) {
  var L = ['Thanks, ' + (a.first || 'there') + '. Your Social Good Hackathon application is in (reference ' + ref + ').',
    'We\'ll be in touch once we\'ve read it. This email is your copy of what you sent us.', '', EVENT_LINE, '',
    'Name: ' + name_(a), 'Email: ' + a.email, 'LinkedIn: ' + (a.linkedin || 'None')];
  if (a.team) {
    L.push('Team: ' + (a.teamName || 'Unnamed') + ', ' + a.size + ' people including you');
    for (var i = 0; i < a.mates.length; i++) {
      var m = a.mates[i];
      L.push('Teammate ' + (i + 2) + ': ' + (m.first + ' ' + m.last).trim() + ', ' + m.email + ', ' + (m.linkedin || 'None'));
    }
  }
  L.push('Why you want to join: ' + (a.why || 'None'), 'Idea: ' + (a.ideaOwn ? 'Your own: ' + (a.ideaText || 'None') : 'One of ours'),
    '', 'Questions? Reply to this email or write to ' + NOTIFY + '.', '', 'Foundry for Good');
  return L.join('\n');
}
