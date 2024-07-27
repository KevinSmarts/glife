    Config.passages.descriptions = function () {
        try{
            let result = "";
            if(State.variables.QSPVAR_s_$pcs_nickname)
                result = State.variables.QSPVAR_s_$pcs_nickname[0];

            if(State.variables.QSPVAR_n_daystart && State.variables.QSPVAR_n_daystart_start){
                const currentDay = State.variables.QSPVAR_n_daystart[0] - State.variables.QSPVAR_n_daystart_start[0] + 1;
                result += ` Day ${currentDay}`;
            }

            if(result)
                return result;
        }
        catch(e){
            //Not so bad. No need to throw an error to anywhere important.
            console.warn(e);
        }

        return "New Game";
    };
