const $cru = (e) => document.querySelector(e),
  $crus = (e) => document.querySelectorAll(e),
  $cruConfig = {
    prefix_url: "",
    headers: { "Content-Type": "application/json" },
    callbacks: {},
  },
  $C = (e = !1) => {
    if (e) for (let t of Object.keys(e)) $cruConfig[t] = e[t];
    $cruLoadEvents();
  },
  $cruLoadEvents = () => {
    $cruLoadRequests(), $cruLoadFormIntercept(), $cruLoadAllContainers();
  },
  $cruLoadContainer = async (e) => {
    e.classList.add("loaded");
    const t = e.closest("[c-container]") || e,
      c = t.getAttribute("c-container"),
      r = t.getAttribute("c-target") || !1,
      a = t.getAttribute("c-type") || "html",
      n = t.getAttribute("c-callback") || !1,
      o = await fetch($cruConfig.prefix_url + c, {
        method: "GET",
        headers: $cruConfig.headers,
      }),
      s = await $cruTypeResponse(a, o),
      u = r ? $cru(r) : t;
    (r || "off" != r) &&
      (r ? (u.innerHTML = s) : "html" == a && (u.innerHTML = s)),
      n && $cruConfig.callbacks[n](s, u),
      $cruLoadEvents();
  },
  $cruLoadAllContainers = async () => {
    $crus("[c-container]:not(.loaded)").forEach(async (e) => {
      e.classList.add("loaded"), $cruLoadContainer(e);
    }),
      $crus("[c-reload]:not(.loaded)").forEach(async (e) => {
        e.classList.add("loaded"),
          e.addEventListener("click", (t) => $cruLoadContainer(e));
      });
  },
  cruRequest = async (e, t) => {
    const c = e.getAttribute(`c-${t}`),
      r = e.getAttribute("c-type") || "html",
      a = e.getAttribute("c-reload-container") || !1,
      n = e.getAttribute("c-remove-closest") || !1,
      o = e.getAttribute("c-swap") || !1,
      s = e.getAttribute("c-callback") || !1,
      u = e.getAttribute("c-target") || !1,
      d = await fetch($cruConfig.prefix_url + c, {
        method: t,
        headers: $cruConfig.headers,
      }),
      i = await $cruTypeResponse(r, d),
      l = !!u && $cru(u);
    n && e.closest(n).remove(),
      o && ($cru(o).outerHTML = i),
      a && $cruLoadContainer(e),
      l && (l ? (l.innerHTML = i) : "html" == r && (e.innerHTML = i)),
      s && $cruConfig.callbacks[s](i, l),
      $cruLoadEvents();
  },
  $cruLoadRequests = () => {
    $crus("[c-delete]:not(.loaded)").forEach((e) => {
      e.classList.add("loaded"),
        e.addEventListener("click", async (t) => {
          cruRequest(e, "delete");
        });
    }),
      $crus("[c-put]:not(.loaded)").forEach((e) => {
        e.classList.add("loaded"),
          e.addEventListener("click", async (t) => {
            cruRequest(e, "put");
          });
      }),
      $crus("[c-get]:not(.loaded)").forEach((e) => {
        e.classList.add("loaded"),
          e.addEventListener("click", async (t) => {
            cruRequest(e, "get");
          });
      }),
      $crus("[c-post]:not(.loaded)").forEach((e) => {
        e.classList.add("loaded"),
          e.addEventListener("click", async (t) => {
            cruRequest(e, "post");
          });
      });
  },
  $cruLoadFormIntercept = () => {
    $crus(".c-form:not(.loaded)").forEach((e) => {
      e.classList.add("loaded"),
        e.addEventListener("submit", async (t) => {
          t.preventDefault();
          const c = e.getAttribute("action"),
            r = e.getAttribute("method").toUpperCase() || "POST",
            a = e.getAttribute("c-type") || "html",
            n = e.getAttribute("c-append") || !1,
            o = e.getAttribute("c-prepend") || !1,
            s = e.getAttribute("c-reset") || !1,
            u = e.getAttribute("c-swap") || !1,
            d = e.getAttribute("c-target") || !1,
            i = e.getAttribute("c-reload-container") || !1,
            l = e.getAttribute("c-callback") || !1,
            $ = $cruIsRead(r),
            L = Object.fromEntries(new FormData(t.target).entries()),
            g = cruFormatURL(c, $, L),
            f = await fetch(g, {
              method: r,
              headers: $cruConfig.headers,
              body: $ ? null : JSON.stringify(L),
            }),
            b = await $cruTypeResponse(a, f);
          u && ($cru(u).outerHTML = b),
            n && $cru(n).insertAdjacentHTML("beforeend", b),
            o && $cru(o).insertAdjacentHTML("afterbegin", b),
            d && ($cru(d).innerHTML = b),
            s && e.reset(),
            i && $cruLoadContainer(e),
            l && $cruConfig.callbacks[l](b, e),
            $cruLoadEvents();
        });
    });
  },
  cruFormatURL = (e, t, c) => {
    let r = $cruConfig.prefix_url + e;
    if (t)
      try {
        r = new URL(e);
      } catch (t) {
        try {
          r = new URL(window.location.origin + e);
        } catch (t) {
          throw e;
        }
      } finally {
        (r.search = new URLSearchParams(c).toString()), (r = r.href);
      }
    return r;
  },
  $cruCallback = (e, t) => {
    $cruConfig.callbacks[e] = t;
  },
  $cruIsRead = (e) => ["GET", "HEAD"].includes(e),
  $cruTypeResponse = async (e, t) =>
    "html" == e ? await t.text() : await t.json();
$C();
