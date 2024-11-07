/**
 * 在从WOS里面导入文献的时候，如果有一些未识别的字段，例如引用数量，Zotero会把这些字段统一使用一个Note来进行表示。
 * 而引用数量事实上并不能提供足够多的有效信息，反而产生了大量的无用的笔记。
 * 因此有必要将这些引用数量进行删除。
 */

(async () => {
  const pane = Zotero.getActiveZoteroPane();
  const items = pane.getSelectedItems();
  for (const item of items) {
    if (item.itemType !== "journalArticle") continue;
    const itemTitle = item.getDisplayTitle();
    const noteIds = item.getNotes(false);
    if (noteIds.length === 0) continue;
    for (const noteId of noteIds) {
      const note = Zotero.Items.get(noteId);
      const noteTitle = note.getDisplayTitle();
      if (noteTitle.startsWith("Times Cited in Web of Science")) {
        await Zotero.Items.trashTx(note.id);
        console.log(`Deleted note of "${itemTitle}"`);
      } else {
        console.log(`Skipped: ${noteTitle}`);
      }
    }
  }
})().then();
