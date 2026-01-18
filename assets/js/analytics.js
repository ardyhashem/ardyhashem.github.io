/*  
===============================================================
  analytics.js — Unified GoatCounter + Interaction Tracking
  Author: Ardy Hashem
  Purpose:
    - Track visits across multiple domains using a single
      GoatCounter account.
    - Include hostname in the path so domains remain distinguishable.
    - Track high‑signal interactions:
        • Bold-text hover previews
        • Certification hover previews
        • Screenshot preview triggers
        • Outbound link clicks
        • Scroll depth milestones
        • Hash-based navigation (SPA-like behavior)
  Notes:
    - Safe to include on both domains with no changes.
    - All events are sent as GoatCounter "event" hits.
  Usage:
    • Save script, for example as analytics.js in /assets/js/
    • Add the following to your HTML just before counting goats
        <script>
        window.goatcounter = {
          path: function (p) {
            return location.host + p;
          }
        };
        </script>
    • Add the following to your HTML just after goat counting:
        <script src="/assets/js/analytics.js"></script>
  Example:

<script>
  window.goatcounter = {
    path: function (p) {
      return location.host + p;
    }
  };
</script>

<script data-goatcounter="https://ardyhash.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>

<script src="/assets/js/analytics.js"></script>

===============================================================
*/


/* -------------------------------------------------------------
   1. Configure GoatCounter to include hostname in the path
------------------------------------------------------------- */
window.goatcounter = {
  path: function (p) {
    // Example output: "ardyhash.github.io/about"
    return location.host + p;
  }
};


/* -------------------------------------------------------------
   2. Utility: Send a custom GoatCounter event
------------------------------------------------------------- */
function trackEvent(path, title) {
  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({
      path: path,
      title: title,
      event: true
    });
  }
}


/* -------------------------------------------------------------
   3. Bold-text hover previews
      Tracks when users hover over <b> or <strong> elements.
------------------------------------------------------------- */
document.querySelectorAll('b, strong').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const label = el.textContent.trim();
    const slug = label.toLowerCase().replace(/\s+/g, '-');

    trackEvent(
      `/hover/bold/${slug}`,
      `Bold Hover: ${label}`
    );
  });
});


/* -------------------------------------------------------------
   4. Certification hover previews
      Requires elements like:
      <div class="certification" data-cert="network-plus">...</div>
------------------------------------------------------------- */
document.querySelectorAll('.certification').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const cert = el.dataset.cert || 'unknown-cert';

    trackEvent(
      `/hover/cert/${cert}`,
      `Certification Hover: ${cert}`
    );
  });
});


/* -------------------------------------------------------------
   5. Screenshot preview triggers
      Call trackScreenshotPreview('id') inside your preview logic.
------------------------------------------------------------- */
function trackScreenshotPreview(id) {
  trackEvent(
    `/preview/${id}`,
    `Screenshot Preview: ${id}`
  );
}
// Expose globally so your preview code can call it
window.trackScreenshotPreview = trackScreenshotPreview;


/* -------------------------------------------------------------
   6. Outbound link tracking
      Tracks clicks on external links (http/https).
------------------------------------------------------------- */
document.querySelectorAll('a[href^="http"]').forEach(link => {
  link.addEventListener('click', () => {
    const host = link.hostname;

    trackEvent(
      `/outbound/${host}`,
      `Outbound: ${link.href}`
    );
  });
});


/* -------------------------------------------------------------
   7. Scroll depth tracking
      Fires at 25%, 50%, 75%, 100%.
------------------------------------------------------------- */
let maxScroll = 0;

window.addEventListener('scroll', () => {
  const scrollPercent = Math.floor(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  );

  // Only fire at 25% increments, and only once per milestone
  if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
    maxScroll = scrollPercent;

    trackEvent(
      `/scroll/${scrollPercent}`,
      `Scroll Depth: ${scrollPercent}%`
    );
  }
});


/* -------------------------------------------------------------
   8. Hash-based navigation tracking
      Useful for SPA-like behavior or section-based navigation.
------------------------------------------------------------- */
window.addEventListener('hashchange', () => {
  const fullPath = location.host + location.pathname + location.hash;

  trackEvent(
    `/nav/${location.hash.replace('#', '') || 'root'}`,
    `Hash Navigation: ${fullPath}`
  );
});
