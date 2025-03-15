(async () => {
  // eslint-disable-next-line no-undef
  const items = Zotero.getActiveZoteroPane().getSelectedItems()

  if (!items || items.length === 0) {
    return;
  }

  for (let item of items) {
    const extra = item.getField("extra") || "";
    const newExtra = extra
      .split("\n")
      .filter(line => !line.trim().startsWith("titleTranslation:"))
      .join("\n");

    item.setField("extra", newExtra);
    await item.saveTx();
  }
})().then()