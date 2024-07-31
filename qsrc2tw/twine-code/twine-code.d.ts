declare module "twine-sugarcube" {
    export interface SugarCubeSetupObject {
        Example: { new(): Example };

        //#region Player Character
            attributes: string[];
            proficiencies: {[proficiencyId:string]: ProficiencyDefinition};
            skills: {[skillId:string]: SkillDefinition};
            PlayerCharacter: { new(): PlayerCharacter };
            Skill: { new(): Skill };
            Skills: {
                new(): Skills;
                createProxy: ((skills:Skills)=>{[skillId:string]:Skill});
            };
        //#endregion

        /**
         * Provides functions to overwrite behavior of functions and variables
         */
        Overwrite: {

            /**
             * Registers code that will be run whenever a `setup.qsp_func()`- call occurs for the given `passageName`.
             *
             * If the function `func` returns anything but `undefined`, this value will be returned by `setup.qsp_func()` and default behavior (executing the code of the passage) is skipped.
             *
             * @type {(passageName:string, func:((args: any[])=>any))=>void}
             */
            funcRegister: (passageName:string, func:((args: any[])=>any))=>void,

            /**
             * Registers code that will be run whenever a `setup.qsp_gs()`- call occurs for the given `passageName`.
             *
             * If the function `exec` returns anything but `undefined`, the default behavior (executing the code of the passage) is skipped.
             *
             * @type {(passageName:string, func:((args: any[])=>any))=>void}
             */
            gsRegister: (passageName: string, exec:((args: any[])=>any))=>void,


            /**
             * Specify `get` to return a constant value when a certain value is requested. Alternatively, you can specify a function, that returns a value. If `undefined` is returned, standard behavior is executed.
             *
             * Likewise, you can specify `set` to execute code when a value is set. If `set` returns anything but `undefined` standard behavior (setting the var) is skipped.
             *
             */
            varRegister: (varname:string,
                get:number|string|((index?:number)=>any)|undefined,
                set:((index:number,val:number|string)=>any)|undefined,
            )=>void
        };
    }

    export interface SugarCubeStoryVariables{
        PC: PlayerCharacter;

    }
}

declare global {
    interface Window { QSP: {[key:(string|number)]: any}; }
}

export interface ProficiencyDefinition{
    calc: (attributs:{[skillId:string]:Skill}, skills: {[skillId:string]:Skill}) => number;
}

export interface SkillDefinition{
    attributes: string[];
}

export {};
