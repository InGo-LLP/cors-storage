export function contentLoaded() {
  return new Promise(resolve => {
    var state = document.readyState;
    if (state === "interactive" || state === "complete") {
      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", () => resolve());
    }
  });
}
