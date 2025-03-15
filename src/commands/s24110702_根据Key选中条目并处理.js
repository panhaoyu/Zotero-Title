/**
 * 实现这个脚本的作用是，有时对于大量的文献，需要借助ChatGPT对条目进行筛选。
 * 该过程是通过在Zotero中将条目列表导出为csv后在ChatGPT里面进行处理，然后再对于筛选后的keys进行处理的。
 * 在筛选后，可以进行一些处理，比如从当前分类中移除。
 */

(async () => {
  const pane = Zotero.getActiveZoteroPane();
  const items = pane.getSelectedItems();
  const library = pane.getSelectedLibraryID();
  const filteredKeys = ["57KDAGXI", "DMB4RTSN", "RSNXSPSN", "8UW8YL94", "PS98TBK4", "ZMZSEBN4", "HSTAA4EE", "F8AYP9P8", "6CS4CTVI", "TC4AIQW7", "MWZUX9V4"];
  const itemIds = filteredKeys.map(i => Zotero.Items.getByLibraryAndKey(library, i).id);
  console.log("Item ids:");
  console.log(itemIds);
  const collection = pane.getSelectedCollection();
  console.log(`Collection: ${collection.name}`);
  await Zotero.DB.executeTransaction(async () => {
    await collection.removeItems(itemIds);
  });
})().then();