setup.qsp_mid = (s,start,length=undefined) => {
    s = ""+s;
    //qsp_mid("5000",1,1) => "5" == "5000".substring(0,1)
    return (length != undefined) ? s.substring(start-1,start-1+length) : s.substring(start-1);
}