
setup.editorSave = (passage,newContent) => {
    const escapedChars = {
        '&' : '&amp;',
		'<' : '&lt;',
		'>' : '&gt;',
		'"' : '&quot;',
		"'" : '&#39;',
		'`' : '&#96;'
    };

    let sanitizedNewContent = newContent;

    for(const [toBeEscaped, asEscaped] of Object.entries(escapedChars))
        sanitizedNewContent = sanitizedNewContent.replaceAll(toBeEscaped,asEscaped);


    const localStorageModsKey = "SweetCube.Modifications";

    const updateObject = {};
    updateObject[passage] = sanitizedNewContent;

    const currentModificationsString = localStorage.getItem(localStorageModsKey) ?? "{}";
    const currentModifications = JSON.parse(currentModificationsString);
    const newModifications = Object.assign({},currentModifications,updateObject);
    const newModificationsString = JSON.stringify(newModifications);
    localStorage.setItem(localStorageModsKey, newModificationsString);

    location.reload();
}
