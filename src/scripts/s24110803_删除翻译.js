/**
 * 如果 DOI 存在且格式正确，则删除 URL 字段
 *
 * @param {Array} items - 选中的文献条目列表
 */
async function processItems(items) {

  if (!items || items.length === 0) {
    return;
  }

  for (let item of items) {
    const extra = item.getField("extra") || "";  // 获取 'extra' 字段
    const newExtra = extra
      .split("\n")                               // 将内容按行分割
      .filter(line => !line.trim().startsWith("titleTranslation:"))  // 删除包含 'titleTranslation:' 的行
      .join("\n");                               // 重新组合成字符串

    item.setField("extra", newExtra);            // 设置新的 'extra' 字段内容
    await item.saveTx();                         // 保存更改
  }
}

// 执行处理选中文献的函数
await processItems(items);
