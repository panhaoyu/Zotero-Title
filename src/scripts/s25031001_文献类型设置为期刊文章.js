/**
 * 如果 DOI 存在且格式正确，则删除 URL 字段
 *
 * @param {Array} items - 选中的文献条目列表
 */
async function processItems(items) {
  if (!items || items.length === 0) {
    return;
  }

  await Zotero.DB.executeTransaction(async () => {
    for (const item of items) {
      if (item.itemType === "webpage" || item.itemType === "document") {
        item.setType(Zotero.ItemTypes.getID("journalArticle"));
        let title = item.getField("title");

        // 处理竖线分隔的标题格式
        const splitTitle = title.split("|").map(s => s.trim());
        if (splitTitle.length > 1) {
          title = splitTitle[0];
        }

        item.setField("title", title);
        await item.save();        // 保存更改
      }
    }
  });

}

// 执行处理选中文献的函数
await processItems(items);
