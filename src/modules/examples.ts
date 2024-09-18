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
    const mapping = Object.fromEntries(
      extra.map(i => i.split(":", 2)).filter(i => i.length === 2)
    );
    const finalTitle = mapping["titleTranslation"] ?? rawTitle;

    const stars = UIExampleFactory.getStarRating(item);

    return `${stars}${finalTitle}`;
  }

  static getStarRating(item: Zotero.Item): string {
    if (!getPref("enable-star")) return "";

    if (item.hasTag("⭐⭐⭐⭐⭐")) return "⭐⭐⭐⭐⭐";
    if (item.hasTag("⭐⭐⭐⭐")) return "⭐⭐⭐⭐🌙";
    if (item.hasTag("⭐⭐⭐")) return "⭐⭐⭐🌙🌙";
    if (item.hasTag("⭐⭐")) return "⭐⭐🌙🌙🌙";
    if (item.hasTag("⭐")) return "⭐🌙🌙🌙🌙";

    return "🌙🌙🌙🌙🌙";
  }

  static async registerTitle() {
    Zotero.Item.prototype.getDisplayTitle = function() {
      return UIExampleFactory.getDisplayTitle(this);
    };
  }

  static async registerShortcuts() {
    ztoolkit.Keyboard.register((ev, keyOptions) => {
      if (ev.ctrlKey && ev.altKey && /^[0-5]$/.test(ev.key)) {
        UIExampleFactory.updateStarRating(Number.parseInt(ev.key));
      }
    });
  }

  static async updateStarRating(value: number) {
    const starTags = ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"];
    const pane = Zotero.getActiveZoteroPane();
    const items = pane.getSelectedItems();

    for (const item of items) {
      for (const tag of starTags) item.removeTag(tag);
      if (value > 0) item.addTag("⭐".repeat(value));
    }
  }
}