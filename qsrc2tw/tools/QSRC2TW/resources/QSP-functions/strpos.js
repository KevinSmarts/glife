setup.qsp_strpos = (s, search, ...additionalArgs) => {
    if(additionalArgs[0])
        throw new Error("setup.qsp_strpos with more than 2 arguments is not implemented.");
    return s.indexOf(search)+1;
}
