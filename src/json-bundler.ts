import * as fs from 'fs';

/**
 * JSON Bundler
 */
export class JSONBundler {

    private readonly inputPath: string;

    constructor( inputPath: string ) {
        this.inputPath = inputPath;
    }

    public bundle(): any {



    }

}

const jsonBundler = new JSONBundler( './test/entry.json' );
