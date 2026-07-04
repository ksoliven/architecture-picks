const materialTabs = [...document.querySelectorAll(".materials-tab")];
const materialPanels = [...document.querySelectorAll(".materials-tab-panel")];

materialTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    materialTabs.forEach((item) => {
      item.classList.toggle("active", item === tab);
      item.setAttribute("aria-selected", item === tab ? "true" : "false");
    });

    materialPanels.forEach((panel) => {
      const active = panel.id === tab.dataset.tab;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  });
});
