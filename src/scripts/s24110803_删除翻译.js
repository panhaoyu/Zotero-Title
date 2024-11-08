/**
 * 删除翻译字段。
 */

(async () => {
  const pane = Zotero.getActiveZoteroPane();
  const items = pane.getSelectedItems();
  for (const item of items) {
    const extra = item.getField("extra") || "";  // 获取 'extra' 字段
    const newExtra = extra
      .split("\n")                               // 将内容按行分割
      .filter(line => !line.trim().startsWith("titleTranslation:"))  // 删除包含 'titleTranslation:' 的行
      .join("\n");                               // 重新组合成字符串

    item.setField("extra", newExtra);            // 设置新的 'extra' 字段内容
    await item.saveTx();                         // 保存更改
  }
})();
