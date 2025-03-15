/**
 * 在从Web of Science（WOS）导入文献数据时，有些字段（如引用数量）可能未被识别并被Zotero处理为Note（注释）。
 * 然而引用数量并非必要信息，通常会产生大量无用的注释内容。
 * 本代码通过自动化删除这些“引用数量”类型的注释，以清理Zotero中的冗余内容。
 *
 * 使用方法：在列表页面中选中需要处理的条目，然后在控制台里面执行此代码。
 */

(async () => {
  // 获取当前Zotero活动窗格的引用，pane用于访问当前选定的项目
  const pane = Zotero.getActiveZoteroPane();

  // 获取用户在Zotero界面中选择的文献项（items），这是一个文献对象数组
  const items = pane.getSelectedItems();

  // 遍历每一个选中的文献项
  for (const item of items) {
    // 仅处理类型为“journalArticle”（期刊文章）的项目，跳过其他类型
    if (item.itemType !== "journalArticle") continue;

    // 获取文献标题以用于后续输出日志
    const itemTitle = item.getDisplayTitle();

    // 获取该文献项的所有Note（注释）ID，参数false表示获取所有的注释，不包括子项注释
    const noteIds = item.getNotes(false);

    // 如果文献项没有任何注释，直接跳过进入下一个循环
    if (noteIds.length === 0) continue;

    // 遍历文献项的每一个注释ID
    for (const noteId of noteIds) {
      // 通过注释ID获取具体的Note对象
      const note = Zotero.Items.get(noteId);

      // 获取注释的标题，用于判断是否为“引用数量”类型的注释
      const noteTitle = note.getDisplayTitle();

      // 检查注释标题是否以“Times Cited in Web of Science”开头，
      // 如果是，则判断其为引用数量的注释，执行删除操作
      if (noteTitle.startsWith("Times Cited in Web of Science")) {
        // 使用Zotero的trashTx方法异步删除该注释，以实现事务管理
        await Zotero.Items.trashTx(note.id);

        // 输出删除操作的日志，标记已删除的注释的文献标题
        console.log(`Deleted note of "${itemTitle}"`);
      } else {
        // 如果不是引用数量注释，跳过此项并输出跳过的注释标题日志
        console.log(`Skipped: ${noteTitle}`);
      }
    }
  }
})().then();