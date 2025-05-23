// 效果不好，不再继续下去了

(async () => {


  /**
   * 生成姓名所有变体格式
   * @param {string} name 中文姓名，格式为"姓氏+名字"
   * @returns {Array} 包含6种变体的数组
   */
  function generateNameVariants(name) {
    if (name.length < 2) return [name]; // 处理单字名

    const surname = name[0]; // 姓氏
    const givenName = name.slice(1); // 名字

    // 中文变体
    const chineseSurnameFirst = name; // 姓在前
    const chineseGivenNameFirst = givenName + surname; // 名在前

    // 拼音转换函数（简化版，实际应用中可能需要更完整的拼音库）
    function toPinyin(chinese) {
      const pinyinMap = {
        '杜': 'du', '时': 'shi', '贵': 'gui', '赵': 'zhao', '程': 'cheng',
        '幸': 'xing', '金': 'jin', '权': 'quan', '刘': 'liu', '涛': 'tao',
        '力': 'li', '国': 'guo', '张': 'zhang', '树': 'shu', '鎏': 'liu',
        '禹': 'yu', '海': 'hai', '高': 'gao', '阳': 'yang', '牛': 'niu',
        '佳': 'jia', '伦': 'lun', '焦': 'jiao', '锋': 'feng', '郑': 'zheng',
        '天': 'tian', '元': 'yuan', '朱': 'zhu', '孟': 'meng', '艳': 'yan',
        '姚': 'yao', '鸿': 'hong', '梁': 'liang', '根': 'gen', '强': 'qiang',
        '旦': 'dan', '钱': 'qian', '源': 'yuan', '丰': 'feng', '收': 'shou',
        '清': 'qing', '照': 'zhao', '董': 'dong', '志': 'zhi', '宏': 'hong',
        '宋': 'song', '爽': 'shuang', '阮': 'ruan', '鹏': 'peng', '王': 'wang',
        '友': 'you', '龙': 'long', '谢': 'xie', '东': 'dong', '武': 'wu',
        '央': 'yang', '卓': 'zhuo', '玛': 'ma', '岩': 'yan', '超': 'chao',
        '巴': 'ba', '罗': 'luo', '布': 'bu'
      };

      return chinese.split('').map(char => pinyinMap[char] || char).join('');
    }

    // 拼音变体
    const pinyinSurname = toPinyin(surname);
    const pinyinGivenName = toPinyin(givenName);
    const pinyinSurnameFirst = pinyinSurname + pinyinGivenName; // 拼音姓在前
    const pinyinGivenNameFirst = pinyinGivenName + pinyinSurname; // 拼音名在前

    // 拼音首字母变体
    const initialSurname = pinyinSurname[0];
    const initialGivenName = pinyinGivenName[0];
    const initialSurnameFirst = initialSurname + (pinyinGivenName.length > 0 ? initialGivenName : ''); // 首字母姓在前
    const initialGivenNameFirst = initialGivenName + initialSurname; // 首字母名在前

    return [
      chineseSurnameFirst,
      chineseGivenNameFirst,
      pinyinSurnameFirst,
      pinyinGivenNameFirst,
      initialSurnameFirst,
      initialGivenNameFirst
    ];
  }

// 原始姓名列表
  const names = [
    '赵程', '杜时贵', '幸金权', '刘涛', '赵力国', '张金树', '刘鎏', '禹海涛',
    '高阳', '牛佳伦', '焦国锋', '郑天元', '朱孟艳', '姚鸿梁', '张根', '强旦',
    '钱源', '刘涛', '张丰收', '张清照', '董志宏', '宋爽', '阮鹏', '王友涛',
    '金龙', '谢东武', '央金卓玛', '杜岩', '张元超', '旦巴罗布'
  ];

// 生成所有变体并合并到一个数组
  const selectedAuthors = names.flatMap(generateNameVariants);

  const pane = Zotero.getActiveZoteroPane()
  const items = pane.getSelectedItems()
  const authors = []
  for (const item of items) {
    const creators = item.getCreators().map(
      creator =>
        `${creator.firstName}${creator.lastName}`
          .toLowerCase()
          .replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '')
    )
    const indices = selectedAuthors.map(i => creators.indexOf(i)).map(i => i < 0 ? 1000 : i)
    const ourFirstCreatorIndex = Math.min(...indices)
    const ourFirstCreator = creators[ourFirstCreatorIndex]
    const ourCreatorIndex = creators.indexOf(ourFirstCreator)
    if (ourCreatorIndex === -1) {
      Zotero.log(indices)
      Zotero.log(ourFirstCreator)
      Zotero.log(`Not found our creator: ${creators.toString()}; title: ${item.getField('title')}`)
    }
  }
})().then()
