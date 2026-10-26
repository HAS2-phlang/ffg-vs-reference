// FFG Venture Hackathon: local preview behaviour. Nothing here sends data anywhere.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var menu = document.querySelector('.mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  // Hero video: slow it down like the live site, and respect reduced motion
  var v = document.querySelector('.hero video');
  if (v) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    else {
      v.playbackRate = 0.5;
      v.addEventListener('loadeddata', function () { v.playbackRate = 0.5; });
    }
  }

  // "The Hackathon" in Kaushan Script: thick mask strokes along the letters' centerline reveal the
  // real brush shape in writing order, then the mask is dropped so the word is always whole
  var script = document.getElementById('script-title');
  if (script) {
    var hero = script.closest('.hero');
    var ink = script.querySelector('.ink');
    var done = function () { if (ink) ink.removeAttribute('mask'); };
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) { // plays on every load (Hugh, Oct 22: the writing should always be there)
      done();
      hero.classList.add('static');
    } else {
      var strokes = [].slice.call(script.querySelectorAll('.ink-strokes path'));
      var lens = strokes.map(function (p) { return p.getTotalLength(); });
      var total = 0;
      strokes.forEach(function (p, i) {
        total += lens[i];
        p.style.strokeDasharray = lens[i] + ' ' + (lens[i] + 2);
        p.style.strokeDashoffset = lens[i];
        p.style.visibility = 'hidden';
      });
      var START = 100, WRITE = 1250; // ms: writing runs from 0.1 to 1.35 s (Hugh, Oct 22: 1.25 s)
      var t0 = null;
      var frame = function (now) {
        if (t0 === null) t0 = now + START;
        var p = Math.max(0, Math.min(1, (now - t0) / WRITE));
        var drawn = (1 - Math.cos(p * Math.PI)) / 2 * total;
        var cum = 0;
        for (var i = 0; i < strokes.length; i++) {
          var show = Math.max(0, Math.min(lens[i], drawn - cum));
          strokes[i].style.visibility = show > 0 ? 'visible' : 'hidden';
          strokes[i].style.strokeDashoffset = lens[i] - show;
          cum += lens[i];
        }
        if (p < 1) requestAnimationFrame(frame); else done();
      };
      hero.classList.add('go');
      requestAnimationFrame(frame);
    }
  }

  // Reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Application form (preview only)
  var form = document.getElementById('apply-form');
  if (!form) return;

  function toggleCond(name, values, targetId) {
    var target = document.getElementById(targetId);
    form.querySelectorAll('input[name="' + name + '"]').forEach(function (r) {
      r.addEventListener('change', function () {
        var picked = form.querySelector('input[name="' + name + '"]:checked');
        var show = picked && values.indexOf(picked.value) !== -1;
        target.classList.toggle('show', show);
      });
    });
  }
  // Rafi, Oct 23 (L112): team or individual is the first answer; the team path adds team name and teammates.
  // The hero and closer buttons pass ?as=individual or ?as=team, so the answer is already picked.
  // Hugh, Oct 26: applications post to the Google Apps Script web app (venture-hackathon/apply-collector/HackathonApply.gs),
  // which saves a row in the Sheet and emails Hugh (and the applicant a copy). Paste the /exec URL here.
  var SUBMIT_URL = 'https://script.google.com/macros/s/AKfycbwwN6uw006oO_27Ytq0Wm7g8gJ3-T0QZ4Xph_p58PNqv-vQBF21RtP48UBtLG7rUnuXmA/exec';
  toggleCond('as', ['team'], 'cond-team');
  // Hugh, Oct 26: one block per teammate, shown up to the team size (teammate 1 is the person applying).
  function setTeammates() {
    var team = form.querySelector('input[name="as"]:checked');
    var isTeam = !!(team && team.value === 'team');
    var size = parseInt((document.getElementById('teamsize') || {}).value || '3', 10);
    document.querySelectorAll('.tm').forEach(function (b) {
      var on = isTeam && parseInt(b.getAttribute('data-mate'), 10) <= size;
      b.hidden = !on;
      b.querySelectorAll('input').forEach(function (i) { i.required = on; });
    });
  }
  var ts = document.getElementById('teamsize');
  if (ts) ts.addEventListener('change', setTeammates);
  form.querySelectorAll('input[name="as"]').forEach(function (r) { r.addEventListener('change', setTeammates); });
  setTeammates();
  toggleCond('idea', ['own'], 'cond-idea');
  var as = new URLSearchParams(location.search).get('as');
  var pick = as && form.querySelector('input[name="as"][value="' + as + '"]');
  if (pick) { pick.checked = true; pick.dispatchEvent(new Event('change')); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var team = form.querySelector('input[name="as"]:checked');
    document.getElementById('teamname').required = !!(team && team.value === 'team');
    setTeammates();
    var idea = form.querySelector('input[name="idea"]:checked');
    document.getElementById('ideatext').required = !!(idea && idea.value === 'own');
    if (!form.reportValidity()) return;
    var sentBox = document.getElementById('sent');
    var showSent = function () { sentBox.classList.add('show'); sentBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
    // Local preview (no SUBMIT_URL yet): show the thank-you without sending anything.
    if (!SUBMIT_URL) { showSent(); return; }
    var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var picked = function (name) { var r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; };
    var asTeam = picked('as') === 'team';
    var size = asTeam ? parseInt(v('teamsize') || '3', 10) : 1;
    var mates = [];
    for (var n = 2; asTeam && n <= size; n++) {
      mates.push({ first: v('tm' + n + '-first'), last: v('tm' + n + '-last'), email: v('tm' + n + '-email'), linkedin: v('tm' + n + '-linkedin') });
    }
    var payload = {
      applying_as: picked('as'), first: v('first'), last: v('last'), email: v('email'), linkedin: v('linkedin'),
      team_name: asTeam ? v('teamname') : '', team_size: asTeam ? String(size) : '', teammates: mates,
      why: v('why'), idea: picked('idea'), ideatext: picked('idea') === 'own' ? v('ideatext') : '',
      privacy: !!(form.querySelector('input[name="privacy"]') || {}).checked,
      website_url_2: v('website_url_2'), page: location.href, user_agent: navigator.userAgent
    };
    var btn = document.getElementById('apply-send'), err = document.getElementById('send-error');
    var label = btn.innerHTML;
    btn.disabled = true; btn.textContent = 'Sending...'; err.hidden = true;
    // A form-encoded body keeps this a simple request, so Apps Script needs no CORS preflight (same as the Pitch Forum form).
    fetch(SUBMIT_URL, { method: 'POST', body: new URLSearchParams({ payload: JSON.stringify(payload) }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) throw new Error('not ok');
        form.querySelectorAll('input, textarea, select, button').forEach(function (el) { el.disabled = true; });
        btn.innerHTML = 'Sent';
        showSent();
      })
      .catch(function () { btn.disabled = false; btn.innerHTML = label; err.hidden = false; });
  });
});
