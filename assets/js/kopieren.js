/* «Adresse kopieren»: einziges Skript der Seite. Ohne JavaScript bleibt
   der Knopf verborgen, der E-Mail-Link funktioniert trotzdem. */
(function () {
  var button = document.querySelector("[data-copy]");
  if (!button || !navigator.clipboard) return;
  var status = document.querySelector(".copy-status");
  button.hidden = false;
  button.addEventListener("click", function () {
    navigator.clipboard.writeText(button.dataset.copy).then(
      function () { status.textContent = button.dataset.done; },
      function () { status.textContent = button.dataset.fail; }
    );
  });
})();
