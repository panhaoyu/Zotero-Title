import { getString } from "../utils/locale";
import { getPref } from "../utils/prefs";

export class BasicExampleFactory {
  static registerPrefs() {
    Zotero.PreferencePanes.register({
      pluginID: addon.data.config.addonID,
      src: rootURI + "content/preferences.xhtml",
      label: getString("prefs-title"),
      image: `chrome://${addon.data.config.addonRef}/content/icons/favicon.png`
    }).then();
  }
}

export class UIExampleFactory {
  private static readonly starTags: { [key: string]: string } = {
    "⭐⭐⭐⭐⭐": "⭐⭐⭐⭐⭐",
    "⭐⭐⭐⭐": "⭐⭐⭐⭐🌙",
    "⭐⭐⭐": "⭐⭐⭐🌙🌙",
    "⭐⭐": "⭐⭐🌙🌙🌙",
    "⭐": "⭐🌙🌙🌙🌙"
  };

  static getTranslatedTitle(item: Zotero.Item): string {
    const rawTitle = item.getField("title");
    if (!getPref("enableTranslation")) {
      return rawTitle;
    }
    const extra = item.getField("extra").split("\n");
    const mapping = Object.fromEntries(
      extra.map(i => i.split(":", 2)).filter(i => i.length === 2)
    );
    return mapping["titleTranslation"] ?? rawTitle;
  }

  static getDisplayTitle(item: Zotero.Item): string {
    const stars = UIExampleFactory.getStarRating(item);
    const translation = UIExampleFactory.getTranslatedTitle(item);
    return `${stars}${translation}`;
  }

  static getStarRating(item: Zotero.Item): string {
    if (!getPref("enableStar")) return "";

    for (const [stars, starMoon] of Object.entries(UIExampleFactory.starTags)) {
      if (item.hasTag(stars)) return starMoon;
    }

    return "🌙🌙🌙🌙🌙";
  }

  static async registerTitle() {
    Zotero.Item.prototype.getDisplayTitle = function() {
      return UIExampleFactory.getDisplayTitle(this);
    };
  }

  static async registerShortcuts() {
    if (!getPref("enableStarShortcuts")) return;
    ztoolkit.Keyboard.register((ev, keyOptions) => {
      if (ev.type !== "keyup") return;
      if (ev.altKey && ev.shiftKey && /^Digit[0-5]$/.test(ev.code)) {
        UIExampleFactory.updateStarRating(parseInt(ev.code.replace("Digit", "")));
      }
    });
  }

  static async updateStarRating(value: number) {
    const pane = Zotero.getActiveZoteroPane();
    const items = pane.getSelectedItems();

    for (const item of items) {
      for (const tag of Object.keys(UIExampleFactory.starTags)) item.removeTag(tag);
      if (value > 0) item.addTag("⭐".repeat(value));
      await item.saveTx();
    }
  }
}