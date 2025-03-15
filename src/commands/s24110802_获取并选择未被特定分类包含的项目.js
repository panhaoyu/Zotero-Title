(async () => {
  // 获取当前活动的Zotero窗口面板对象，以便执行后续操作
  const pane = Zotero.getActiveZoteroPane();

  // 获取当前选定的文献库的ID，用于限定操作范围
  const libraryID = pane.getSelectedLibraryID();

  // 异步获取指定文献库中所有分类的唯一键集合（collectionKeys）
  const collectionKeys = await Zotero.Collections.getAllKeys(libraryID);

  // 根据获取的唯一键集合生成每个分类对象的集合
  const collections = collectionKeys.map(i => Zotero.Collections.getByLibraryAndKey(libraryID, i));

  // 定义要操作的目标分类名称
  const collectionName = "重点关注4"; // 请将“重点关注4”替换为实际目标分类名称

  // 查找目标分类对象，匹配条件为名称等于 collectionName
  const targetCollection = collections.find(i => i.name === collectionName);

  // 获取目标分类中所有项目的集合，不包括子分类的项目
  const items = await targetCollection.getChildItems(false);

  // 从目标分类的项目中提取每个项目的唯一键，并存储在 targetKeys 数组中
  const targetKeys = items.map(i => i.key);

  // 获取当前选定的分类对象
  const currentCollection = pane.getSelectedCollection(false);

  // 获取当前分类中的所有项目（不包括子分类的项目）
  const currentItems = currentCollection.getChildItems(false);

  // 筛选出当前分类中不在目标分类中的项目
  const selectedItems = currentItems.filter(current => !targetKeys.includes(current.key));

  // 在Zotero界面中选择筛选出的项目，以便用户可以直接查看
  pane.selectItems(selectedItems.map(i => i.id));
})();