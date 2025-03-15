await Zotero.DB.executeTransaction(async () => {
  const items = Zotero.getActiveZoteroPane().getSelectedItems()

  const journalArticleID = Zotero.ItemTypes.getID("journalArticle")
  const targetTypes = new Set([
    Zotero.ItemTypes.getID("webpage"),
    Zotero.ItemTypes.getID("document")
  ])

  for (const item of items) {
    if (!targetTypes.has(item.itemType)) continue

    // 删除当前条目的PDF附件
    const attachmentIDs = item.getAttachments()
    for (const id of attachmentIDs) {
      const attachment = Zotero.Items.get(id)
      if (attachment.attachmentContentType === "application/pdf") {
        await attachment.erase()
      }
    }

    // 转换条目类型并清理标题格式
    item.setType(journalArticleID)
    const originalTitle = item.getField("title")
    const processedTitle = originalTitle.split("|")[0]?.trim() || originalTitle
    item.setField("title", processedTitle)
    await item.save()
  }
})

