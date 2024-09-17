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

  static async registerExtraColumn() {
    // const rawGetDisplayTitle = Zotero.Item.prototype.getDisplayTitle;
    Zotero.Item.prototype.getDisplayTitle = function() {
      return UIExampleFactory.getDisplayTitle(this);
    };
  }
}
