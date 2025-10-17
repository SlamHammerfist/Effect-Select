import { getGroupedKeys } from "./keyGroups.js";
import { allBonuses } from "./allBonuses.js";

// Patch roll logic to support .all bonuses
Hooks.once("init", () => {
  const OriginalActor = CONFIG.Actor.documentClass;
  CONFIG.Actor.documentClass = allBonuses(CONFIG.Actor.documentClass);
});

// Inject dropdown into Active Effect config
Hooks.on("renderActiveEffectConfig", (app, html) => {
  let parent = app.object?.parent ?? app.options?.parent;

  if (!parent) {
    const match = app.id?.match(/^ActiveEffectConfig-(Actor|Item)-(.+?)-(?:Item-)?(?:ActiveEffect-)?/);
    if (match) {
      const [ , type, id ] = match;
      parent = type === "Actor" ? game.actors.get(id) : game.items.get(id);
    }
  }

  if (!parent || typeof parent !== "object" || !parent.system) return;

  const groupedKeys = getGroupedKeys(parent);
  const $html = $(html);
  const keyInputs = $html.find("input[name$='.key']");

  keyInputs.each(function () {
    const original = $(this);
    const name = original.attr("name");
    const value = original.val();

    const wrapper = $(`<div class="aed-combo-wrapper"></div>`);
    const input = $(`<input type="text" class="aed-combo-input" name="${name}" placeholder="Select key..." autocomplete="off">`).val(value);
    const list = $(`<ul class="aed-combo-list" style="display:none;"></ul>`).appendTo(document.body);

    for (const [group, keys] of Object.entries(groupedKeys)) {
      list.append($(`<li class="aed-combo-header">${group}</li>`));
      keys.sort().forEach(k => {
        const item = $(`<li class="aed-combo-item">${k}</li>`);
        item.on("mousedown", () => {
          input.val(k);
          list.hide();
          input.trigger("input").trigger("change");
        });
        list.append(item);
      });
    }

    const positionDropdown = () => {
      const offset = input.offset();
      if (!offset || offset.top === 0 || offset.left === 0) return;
      list.css({
        position: "absolute",
        top: `${offset.top + input.outerHeight()}px`,
        left: `${offset.left}px`,
        zIndex: 10000,
        display: "block"
      });
    };

    let currentIndex = -1;
    let dropdownVisible = false;

    const updateHighlight = () => {
      const items = list.children(".aed-combo-item:visible");
      items.removeClass("aed-highlight");
      if (currentIndex >= 0 && currentIndex < items.length) {
        items.eq(currentIndex).addClass("aed-highlight");
        items.eq(currentIndex)[0].scrollIntoView({ block: "nearest" });
      }
    };

    input.on("keydown", (event) => {
      const items = list.children(".aed-combo-item:visible");
      if (!items.length) return;

      if (event.key === "ArrowDown" && currentIndex < items.length - 1) {
        event.preventDefault();
        currentIndex++;
        updateHighlight();
      }

      if (event.key === "ArrowUp" && currentIndex > 0) {
        event.preventDefault();
        currentIndex--;
        updateHighlight();
      }

      if (event.key === "Enter" && currentIndex >= 0 && currentIndex < items.length) {
        event.preventDefault();
        input.val(items.eq(currentIndex).text());
        list.hide();
        input.trigger("input").trigger("change");
        dropdownVisible = false;
      }

      if (event.key === "Escape") {
        list.hide();
        dropdownVisible = false;
        currentIndex = -1;
      }
    });

    input.on("input", () => {
      const query = input.val().toLowerCase();
      currentIndex = -1;

      list.children(".aed-combo-item").each(function () {
        const text = $(this).text();
        const index = text.toLowerCase().indexOf(query);

        if (query && index !== -1) {
          const before = text.slice(0, index);
          const match = text.slice(index, index + query.length);
          const after = text.slice(index + query.length);
          $(this).html(`${before}<mark>${match}</mark>${after}`).show();
        } else {
          $(this).text(text).toggle(!query);
        }
      });

      list.children(".aed-combo-header").each(function () {
        const nextItems = $(this).nextUntil(".aed-combo-header", ".aed-combo-item");
        $(this).toggle(nextItems.filter(":visible").length > 0);
      });

      positionDropdown();
      dropdownVisible = true;
    });

    input.on("click", () => {
      dropdownVisible = !dropdownVisible;
      dropdownVisible ? positionDropdown() : list.hide();
    });

    input.on("focus", () => {
      if (dropdownVisible) positionDropdown();
    });

    input.on("blur", () => {
      setTimeout(() => {
        list.hide();
        dropdownVisible = false;
      }, 200);
    });

    $(document).on("mousedown.aed", (event) => {
      const target = $(event.target);
      if (!target.closest(".aed-combo-input").length && !target.closest(".aed-combo-list").length) {
        list.hide();
        dropdownVisible = false;
        currentIndex = -1;
      }
    });

    wrapper.append(input);
    original.replaceWith(wrapper);
  });
});