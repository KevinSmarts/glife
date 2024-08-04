setup.Overwrite.varRegisterByPrefix(
    "npc_",
    ((varname,index)=>State.variables.npcs.get(index.toString(), varname)),
    ((varname,index,v)=>State.variables.npcs.set(index.toString(), varname, v)),
);
