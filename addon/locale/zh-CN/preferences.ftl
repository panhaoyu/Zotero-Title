pref-title = 标题插件设置
pref-input = 输入
pref-help = { $name } Build { $version } { $time }
pref-detail = 本插件将替换标题的显示功能。<br/>
    该插件将直接替换掉相应的标题显示函数<br/>
    替换后的格式为：⭐⭐⭐🌙🌙<标题翻译><br/>
    重启后生效。<br/>
    <br/>
    内部细节：<br/>
    星级是从标签中读取的，取其中唯一的以⭐开头的标签。<br/>
    翻译是从“其它”字段里面的，取其中的titleTranslation: XXX后面的内容。<br/>
    <br/>
    可能的冲突：<br>
    与 Ethereal Style 的 Title 功能可能存在冲突，请在其设置页面关闭相应的功能。<br>

pref-enableStar =
    .label = 勾选以开启标题中的星级的显示功能
pref-enableTranslation =
    .label = 勾选以开启标题中的标题翻译功能
pref-enableStarShortcuts =
    .label = 检查以启用星标快捷方式 (Alt+Shift+[1-5] 设置星标；Alt+Shift+0 移除星标)
