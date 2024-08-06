setup.qsp_sidebar = (content) => {
    State.variables.qspSidebarContent = content;
    setup.qsp_sidebarUpdate();
}

setup.qsp_sidebarUpdate = () => {
    $.wiki("<<replace '#sidebar'>><<include 'Sidebar'>><</replace>>");
}