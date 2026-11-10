/* Gemeinsames Skript aller Seiten: Passwortabfrage, Besucherzählung, Anmeldung für die Statistik.
   Hinweis: Das ist eine einfache Sperre im Browser, kein echter Serverschutz. */
(function () {
    'use strict';
    var CONFIG = {
        // Prüfsummen der Passwörter (nicht die Passwörter selbst). Neue Prüfsummen erzeugst du auf stats.html.
        passHash: '84c3db98dc194bb8eb168cd5c96ffb6b2f91cfd53414af8262b086c9ee58e969',
        adminHash: '4ca96230c35e20c3d16c71628c11c185ba016fd64b1bb3f6b236437f2d28fe43',
        // Dein GoatCounter-Name, z. B. 'leoletsplayer' für https://leoletsplayer.goatcounter.com. Leer = Zählung aus.
        goatcounter: ''
    };
    var SALT = 'leoletsplayer:';
    var root = document.documentElement;
    var store = {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
        del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
    };
    function hash(text) {
        return crypto.subtle.digest('SHA-256', new TextEncoder().encode(SALT + text)).then(function (buf) {
            return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
        });
    }
    var unlocked = store.get('site.unlock') === CONFIG.passHash;
    var isAdmin = function () { return store.get('site.admin') === CONFIG.adminHash; };
    var onStats = /stats\.html$/.test(location.pathname);
    if (!unlocked) root.style.visibility = 'hidden';

    /* Dialog im Stil der Seite, unabhängig vom Stylesheet der jeweiligen Unterseite */
    function dialog(opts) {
        var wrap = document.createElement('div');
        wrap.setAttribute('style', 'visibility:visible;position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:16px;background:' + (opts.solid ? '#f5f6f8' : 'rgba(14,17,22,.45)') + ';font:16px/1.5 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#0e1116');
        wrap.innerHTML =
            '<form style="background:#fff;border-radius:20px;box-shadow:0 1px 2px rgba(16,24,40,.04),0 8px 24px rgba(16,24,40,.1);padding:28px;width:min(100%,360px);display:flex;flex-direction:column;gap:14px">' +
            '<div style="font-weight:700;font-size:22px;letter-spacing:-.02em"></div>' +
            '<div style="color:#687182;font-size:15px"></div>' +
            '<input type="password" autocomplete="current-password" aria-label="Passwort" style="font:inherit;padding:12px 14px;border:0;border-radius:12px;background:#f1f3f7;color:inherit;outline-offset:2px">' +
            '<div role="alert" style="color:#b3261e;font-size:14px;min-height:20px"></div>' +
            '<div style="display:flex;gap:8px;justify-content:flex-end"></div></form>';
        var form = wrap.firstChild, parts = form.children, input = parts[2], err = parts[3], row = parts[4];
        parts[0].textContent = opts.title; parts[1].textContent = opts.text;
        var btnStyle = 'font:600 15px/1 inherit;border:0;border-radius:999px;padding:12px 18px;cursor:pointer;';
        if (opts.cancel) {
            var c = document.createElement('button'); c.type = 'button'; c.textContent = 'Abbrechen';
            c.setAttribute('style', btnStyle + 'background:#f1f3f7;color:#0e1116'); c.onclick = function () { wrap.remove(); }; row.appendChild(c);
        }
        var ok = document.createElement('button'); ok.type = 'submit'; ok.textContent = opts.action;
        ok.setAttribute('style', btnStyle + 'background:#2d5bff;color:#fff'); row.appendChild(ok);
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            hash(input.value).then(function (h) {
                if (h === opts.expect) { wrap.remove(); opts.done(h); }
                else { err.textContent = 'Das Passwort stimmt nicht.'; input.select(); }
            }).catch(function () { err.textContent = 'Die Prüfung ist in diesem Browser nicht möglich.'; });
        });
        (document.body || root).appendChild(wrap); input.focus();
    }

    function count() {
        // Eigene Besuche als angemeldeter Betreiber und die Statistikseite werden nicht gezählt
        if (!CONFIG.goatcounter || isAdmin() || onStats) return;
        var s = document.createElement('script'); s.async = true;
        s.src = 'https://gc.zgo.at/count.js';
        s.setAttribute('data-goatcounter', 'https://' + CONFIG.goatcounter + '.goatcounter.com/count');
        document.head.appendChild(s);
    }
    function adminButton() {
        var top = document.querySelector('.top'); if (!top || onStats) return;
        var b = document.createElement('button'); b.className = 'small'; b.id = 'admin-login';
        var paint = function () { b.textContent = isAdmin() ? 'Statistik' : 'Anmelden'; }; paint();
        b.onclick = function () {
            if (isAdmin()) { location.href = 'stats.html'; return; }
            adminLogin(function () { location.href = 'stats.html'; });
        };
        var nav = top.querySelector('.nav');
        if (nav) { var box = document.createElement('div'); box.className = 'row'; nav.parentNode.insertBefore(box, nav); box.appendChild(nav); box.appendChild(b); }
        else top.appendChild(b);
    }
    function adminLogin(done, solid) {
        dialog({ title: 'Anmelden', text: 'Mit dem Betreiber-Passwort siehst du die Statistik der Seite.', action: 'Anmelden', cancel: !solid, solid: solid, expect: CONFIG.adminHash,
            done: function (h) { store.set('site.admin', h); done(); } });
    }
    function start() { count(); adminButton(); document.dispatchEvent(new Event('site:ready')); }
    function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

    ready(function () {
        if (unlocked) { start(); return; }
        dialog({ title: 'Geschützte Seite', text: 'Bitte gib das Passwort ein, um die Seite zu öffnen.', action: 'Öffnen', solid: true, expect: CONFIG.passHash,
            done: function (h) { store.set('site.unlock', h); unlocked = true; root.style.visibility = ''; start(); } });
    });

    window.Site = { config: CONFIG, hash: hash, isAdmin: isAdmin, adminLogin: adminLogin,
        logout: function () { store.del('site.admin'); }, lock: function () { store.del('site.unlock'); store.del('site.admin'); } };
})();
