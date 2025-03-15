/**
 * 通过浏览器扩展保存的网页快照往往并不能保存为期刊文章的格式，而是保存为了网页链接格式。
 * 这导致这些快照无法与原有的条目进行合并，因此需要调整文献的类型。
 */

(async () => {
  const pane = Zotero.getActiveZoteroPane();
  const items = pane.getSelectedItems().filter(i => {
    if (i.itemType !== "webpage") return false;
    // const dateAdded = new Date(i.dateAdded);
    // const referenceDate = new Date("2024-11-08 00:00:00");
    // console.log(referenceDate);
    // if (dateAdded < referenceDate) return false;
    return true;
  });
  pane.selectItems(items.map(i => i.id));
  for (const item of items) {
    if (item.itemType === "webpage") {
      item.setType(Zotero.ItemTypes.getID("journalArticle"));
    }

    const url = new URL(item.getField("url"));
    const hostnameParts = url.hostname.split(".");
    const domain = hostnameParts.length > 1
      ? `${hostnameParts[hostnameParts.length - 2]}.${hostnameParts[hostnameParts.length - 1]}`
      : url.hostname;
    const previousTitle = item.getField("title");
    const previousUrlPath = url.pathname;

    let doi = null;
    switch (domain) {
      case "springer.com":
        doi = previousUrlPath.includes("article/") ? previousUrlPath.split("article/")[1] : null;
        break;
      case "acs.org":
        // https://pubs.acs.org/doi/10.1021/acs.energyfuels.7b00656
        doi = previousUrlPath.includes("/doi/") ? previousUrlPath.split("/doi/")[1] : null;
        break;
      case "wiley.com":
        // https://onlinelibrary.wiley.com/doi/10.1002/adma.202004849
        doi = previousUrlPath.includes("/doi/") ? previousUrlPath.split("/doi/")[1] : null;
        break;
      case "sciencedirect.com":
        // https://www.sciencedirect.com/science/article/pii/S0164121220302321
        doi = previousUrlPath.includes("pii/") ? `10.1016/${previousUrlPath.split("pii/")[1]}` : null;
        break;
      case "tandfonline.com":
        // https://www.tandfonline.com/doi/full/10.1080/00031305.2018.1483727
        doi = previousUrlPath.includes("/doi/") ? previousUrlPath.split("/doi/")[1] : null;
        break;
      default:
        console.log(`未识别的域名: ${domain}`);
    }

    if (doi) {
      item.setField("DOI", doi);
    }
    await item.saveTx();
  }
})().then();


