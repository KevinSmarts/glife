setup.Overwrite.funcRegister("pcs_has_attr",((args)=>{
    const functionName:string = args[0];
    switch (functionName.toLowerCase()){
         case 'and':
            if(args.length == 1)
                return 0;
            for(const bodyTrait of args.slice(1)){
                if(setup.qsp_func("pcs_has_attr", bodyTrait) == 0)
                    return 0;
            }
            return 1;
        case 'or':
            if(args.length == 1)
                return 0;
            for(const bodyTrait of args.slice(1)){
                if(setup.qsp_func("pcs_has_attr", bodyTrait) == 1)
                    return 1;
            }
            return 0;
        case 'nand':
            if(args.length == 1)
                return 0;
            return 1 - (setup.qsp_func("pcs_has_attr", "and", ...(args.slice(1))) as number);
        case 'nor':
            if(args.length == 1)
                return 0;
            return 1 - (setup.qsp_func("pcs_has_attr", "or", ...(args.slice(1))) as number);
        default:
            return undefined;
    }
}));
