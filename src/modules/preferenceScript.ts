import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { setPref } from "../utils/prefs";

export async function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/content/preferences.xhtml onpaneload
  if (!addon.data.prefs) {
    addon.data.prefs = {
      window: _window,
      columns: [
        {
          dataKey: "title",
          label: getString("prefs-table-title"),
          fixedWidth: true,
          width: 100
        },
        {
          dataKey: "detail",
          label: getString("prefs-table-detail")
        }
      ],
      rows: []
      // rows: [
      //   {
      //     title: "Orange",
      //     detail: "It's juicy",
      //   },
      //   {
      //     title: "Banana",
      //     detail: "It's sweet",
      //   },
      //   {
      //     title: "Apple",
      //     detail: "I mean the fruit APPLE",
      //   },
      // ],
    };
  } else {
    addon.data.prefs.window = _window;
  }
  updatePrefsUI();
  bindPrefEvents();
}

async function updatePrefsUI() {
  // You can initialize some UI elements on prefs window
  // with addon.data.prefs.window.document
  // Or bind some events to the elements
  const renderLock = ztoolkit.getGlobal("Zotero").Promise.defer();
  if (addon.data.prefs?.window == undefined) return;
  // const tableHelper = new ztoolkit.VirtualizedTable(addon.data.prefs?.window)
  //   .setContainerId(`${config.addonRef}-table-container`)
  //   .setProp({
  //     id: `${config.addonRef}-prefs-table`,
  //     // Do not use setLocale, as it modifies the Zotero.Intl.strings
  //     // Set locales directly to columns
  //     columns: addon.data.prefs?.columns,
  //     showHeader: true,
  //     multiSelect: true,
  //     staticColumns: true,
  //     disableFontSizeScaling: true,
  //   })
  // .setProp("getRowCount", () => addon.data.prefs?.rows.length || 0)
  // .setProp(
  //   "getRowData",
  //   (index) =>
  //     addon.data.prefs?.rows[index] || {
  //       title: "no data",
  //       detail: "no data",
  //     },
  // )
  // // Show a progress window when selection changes
  // .setProp("onSelectionChange", (selection) => {
  //   new ztoolkit.ProgressWindow(config.addonName)
  //     .createLine({
  //       text: `Selected line: ${addon.data.prefs?.rows
  //         .filter((v, i) => selection.isSelected(i))
  //         .map((row) => row.title)
  //         .join(",")}`,
  //       progress: 100,
  //     })
  //     .show();
  // })
  // When pressing delete, delete selected line and refresh table.
  // Returning false to prevent default event.
  // .setProp("onKeyDown", (event: KeyboardEvent) => {
  //   if (event.key == "Delete" || (Zotero.isMac && event.key == "Backspace")) {
  //     addon.data.prefs!.rows =
  //       addon.data.prefs?.rows.filter(
  //         (v, i) => !tableHelper.treeInstance.selection.isSelected(i),
  //       ) || [];
  //     tableHelper.render();
  //     return false;
  //   }
  //   return true;
  // })
  // // For find-as-you-type
  // .setProp(
  //   "getRowString",
  //   (index) => addon.data.prefs?.rows[index].title || "",
  // )
  // // Render the table.
  // .render(-1, () => {
  //   renderLock.resolve();
  // });
  await renderLock.promise;
  ztoolkit.log("Preference table rendered!");
}

function bindPrefEvents() {
  const enableTitleId = `#zotero-prefpane-${config.addonRef}-title-enable`;
  const enableTitleElement = addon.data.prefs!.window.document.querySelector(enableTitleId);
  enableTitleElement?.addEventListener("command", e => {
    setPref("enable-title", (e.target as XULCheckboxElement).checked);
  });

  const enableStarId = `#zotero-prefpane-${config.addonRef}-star-enable`;
  const enableStarElement = addon.data.prefs!.window.document.querySelector(enableStarId);
  enableStarElement?.addEventListener("command", e => {
    setPref("enable-star", (e.target as XULCheckboxElement).checked);
  });
}
