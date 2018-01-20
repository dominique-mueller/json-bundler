import * as fs from 'fs';
import * as path from 'path';

/**
 * JSON Bundler
 */
export class JSONBundler {

    private readonly files: { [ path: string ]: any };

    private readonly inputPath: string;

    constructor( inputPath: string ) {
        this.files = {};
        this.inputPath = inputPath;
    }

    public bundle(): any {

        const fullPath: string = path.resolve( this.inputPath );
        this.resolveReference( {
            path: fullPath,
        } );

        return this.files[ fullPath ];

    }

    private resolveReference( reference: JSONReference ): any {

        // Read the referenced file (if if has not yet happened already)
        if ( !this.files[ reference.path ] ) {
            this.files[ reference.path ] = this.readFile( reference.path );
        }
        if ( !reference.location ) {
            reference.location = this.files[ reference.path ];
        }

        // Get references
        const references: Array<JSONReference> = this.findReferences( this.files[ reference.path ], path.dirname( reference.path ) );

        references.forEach( ( reference: JSONReference ): void => {
            // TODO: Recursion
            this.resolveReference( reference );
            // TODO: Deeply!
            // TODO: Before & after merging
            Object.assign( reference.location, this.files[ reference.path ] );
            delete reference.location[ '$ref' ];
        } );

    }

    private findReferences( value: any, basePath: string ): any {

        const references: Array<JSONReference> = [];

        // Handle objects (and thus arrays as well)
        if ( value instanceof Object ) {
            Object
                .keys( value )
                .forEach( ( key: string ): void => {

                    // Save reference
                    if ( key === '$ref' ) {
                        references.push( {
                            path: path.resolve( basePath, value[ key ] ),
                            location: value
                        } );
                    }

                    // Continue searching (deeply recursive)
                    references.push( ...this.findReferences( value[ key ], basePath ) );

                } );
        }

        return references;

    }

    private readFile( currentPath: string ): any {
        const fileContent: string = fs.readFileSync( currentPath, 'utf-8' );
        const fileContentParsed: any = JSON.parse( fileContent );
        return fileContentParsed;
    }

}

export interface JSONReference {
    path: string;
    location?: Object;
}

export interface JSONFile {
    content: any;
    references: Array<JSONReference>;
}

const jsonBundler = new JSONBundler( './test/entry.json' );
const bundle = jsonBundler.bundle();
console.log( bundle );
