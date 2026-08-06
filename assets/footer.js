document.addEventListener("DOMContentLoaded", function () {
  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (!footerPlaceholder) {
    console.warn("No footer-placeholder found on this page.");
    return;
  }

  fetch("partials/footer.html")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load partials/footer.html");
      }

      return response.text();
    })
    .then(function (html) {
      footerPlaceholder.innerHTML = html;
    })
    .catch(function (error) {
      console.error("Footer injection failed:", error);
    });
});