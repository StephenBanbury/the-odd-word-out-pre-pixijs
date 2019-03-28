export interface IThesaurus {
    adjective: {
        syn: string[],
        sim: string[]
    };
    noun: {
        syn: string[],
        sim: string[]
    };
    verb: {
        syn: string[],
        sim: string[]
    };    
}
