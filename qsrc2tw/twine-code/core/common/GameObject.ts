abstract class GameObject{
    get clonableFields(){
        return Object.fromEntries(Object.entries(this).filter(([key,v])=>!key.startsWith("$")))
    }

    get ownData(){
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            if(typeof this[pn] !== "function" && !pn.startsWith("$")){
                ownData[pn] = clone(this[pn]);
            }
        }, this);
        return ownData;
    }


    _init(data: { [x: string]: any; }){
        Object.keys(data).forEach(function (pn) {
            this[pn] = clone(data[pn]);
        }, this);

        this._postInit();

        return this;
    }

    _postInit(){}
}
