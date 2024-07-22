Macro.add(["SHOWACTS","SHOWINPUT","SHOWOBJS","SHOWSTAT"],{skipArgs:!1,handler:function(){
    const varname = this.name;
    QSP[varname][0] = (this.args[0]) ? 1 : 0;
}});