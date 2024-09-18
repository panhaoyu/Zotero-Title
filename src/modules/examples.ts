import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { getPref } from "../utils/prefs";

export class BasicExampleFactory {
  static registerPrefs() {
    ztoolkit.PreferencePane.register({
      pluginID: config.addonID,
      src: rootURI + "chrome/content/preferences.xhtml",
      label: getString("prefs-title"),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
      defaultXUL: true
    });
  }
}


export class UIExampleFactory {
  static getDisplayTitle(item: Zotero.Item): string {
    const rawTitle = item.getField("title");
    const extra = item.getField("extra").split("\n");
    const mappingItems = extra.map(i => i.split(":", 2)).filter(i => i.length === 2);
    const mapping = Object.fromEntries(mappingItems);
    const translatedTitle = mapping["titleTranslation"];
    const finalTitle = translatedTitle ?? rawTitle;

    let stars = "";
    if (getPref("enable-star")) {
      if (item.hasTag("⭐⭐⭐⭐⭐")) {
        stars = "⭐⭐⭐⭐⭐";
      } else if (item.hasTag("⭐⭐⭐⭐")) {
        stars = "⭐⭐⭐⭐🌙";
      } else if (item.hasTag("⭐⭐⭐")) {
        stars = "⭐⭐⭐🌙🌙";
      } else if (item.hasTag("⭐⭐")) {
        stars = "⭐⭐🌙🌙🌙";
      } else if (item.hasTag("⭐")) {
        stars = "⭐🌙🌙🌙🌙";
      } else {
        stars = "🌙🌙🌙🌙🌙";
      }
    }

    return `${stars}${finalTitle}`;
  }

  static async registerTitle() {
    Zotero.Item.prototype.getDisplayTitle = function() {
      return UIExampleFactory.getDisplayTitle(this);
    };
  }

  static async registerShortcuts() {
    async function func(value: number | null) {
      const starTags = ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"];
      const pane = Zotero.getActiveZoteroPane();
      const items = pane.getSelectedItems();
      for (const item of items) {
        for (const tag of starTags) if (item.hasTag(tag)) item.removeTag(tag);
        if (value > 0) item.addTag("⭐".repeat(value));
      }
    }

    ztoolkit.Keyboard.register((ev, keyOptions) => {
      if (ev.ctrlKey && ev.altKey) {
        switch (ev.key) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
            func(Number.parseInt(ev.key));
            break;
        }
      }
    });
  }
}