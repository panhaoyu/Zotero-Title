pref-title = Addon Template Example
pref-input = Input
pref-help = { $name } Build { $version } { $time }
pref-detail = This plug-in will replace the display function of the title.<br/>
    This plug-in will directly replace the corresponding title display function<br/>
    The replaced format is: ⭐⭐⭐🌙🌙<titleTranslation><br/>
    It will take effect after restarting.<br/>
    <br/>
    Internal details:<br/>
    The star rating is read from the tags, and the only tag starting with ⭐ is taken.<br/>
    The translation is from the "Other" field, and the content after titleTranslation: XXX is taken.<br/>
    <br/>
    Possible conflicts:<br>
    There may be conflicts with the Title function of Ethereal Style. Please turn off the corresponding function on its settings page.<br>

pref-enableStar =
    .label = Check to turn on the star rating in the title
pref-enableTranslation =
    .label = Check to turn on the title translation
pref-enableStarShortcuts =
    .label = Check to turn on star shortcuts (Alt+Shift+[1-5] to set star; Alt+Shift+0 to remove star)
