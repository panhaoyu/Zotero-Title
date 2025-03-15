const result = ['Log:']
await Zotero.DB.executeTransaction(async () => {
  const items = Zotero.getActiveZoteroPane().getSelectedItems()
  const total = items.length
  if (total === 0) return;

  for (let [index, item] of items.entries()) {
    const extra = item.getField("extra") || "";
    const newExtra = extra
      .split("\n")
      .filter(line => !line.trim().startsWith("titleTranslation:"))
      .join("\n");

    item.setField("extra", newExtra);
    await item.save();
    result.push(`${index + 1}/${total}: ${item.getDisplayTitle().slice(0, 20)}`)
  }
})
// noinspection JSAnnotator
return result.join('\n')