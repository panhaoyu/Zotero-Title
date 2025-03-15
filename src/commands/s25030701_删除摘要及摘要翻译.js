/**
 * 删除全部文献里面的全部摘要，以及全部的摘要翻译
 *
 * @param {Array} items - 选中的文献条目列表
 */
async function processItems() {
  const library = ZoteroPane.getSelectedLibraryID();
  const items = (await Zotero.Items.getAll(library))
    .filter(i => i.isTopLevelItem());
  if (!items || items.length === 0) {
    return;
  }
  const total = items.length;
  let finished = 0;
  for (let item of items) {
    item.setField("abstractNote", "");  // 删除摘要
    const extra = item.getField("extra") || "";  // 获取 'extra' 字段
    const newExtra = extra
      .split("\n")  // 将内容按行分割
      .filter(line => !line.trim().startsWith("abstractTranslation:"))  // 删除包含 'abstractTranslation:' 的行
      .join("\n");  // 重新组合成字符串
    item.setField("extra", newExtra);  // 设置新的 'extra' 字段内容
    await item.save();  // 保存更改
    finished += 1;
    Zotero.log(`${finished} / ${total}`);
  }
}

// 执行处理选中文献的函数
await Zotero.DB.executeTransaction(async () => {
  await processItems();
});