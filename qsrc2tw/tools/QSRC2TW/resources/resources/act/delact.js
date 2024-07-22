 setup.qsp_delact = (label) => {
    const index = State.temporary.actions.findIndex((action)=>action.label == label);
    if(index >= 0)
        State.temporary.actions = State.temporary.actions.toSpliced(index, 1);
 }