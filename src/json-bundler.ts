import * as fs from 'fs';
import * as path from 'path';

import * as JSON5 from 'json5';
import * as assignDeep from 'assign-deep';
import * as fsExtra from 'fs-extra';

import { JSONReference } from './json-reference.interface';

/**
 * JSON Bundler
 */
export class JSONBundler {

    /**
     * Files, changed while bundling happens
     */
    private files: { [ path: string ]: any };

    /**
     * Constructor
     */
    constructor() {
        this.files = {};
    }

    /**
     * Bundle
     *
     * @param inputPath  - Input path
     * @param outputPath - Output path
     */
    public bundle( inputPath: string, outputPath: string ): void {

        // Resolve paths
        const fullInputPath: string = path.resolve( inputPath );
        const fullOutputPath: string = path.resolve( outputPath );

        // Resolve references
        this.resolveReference( {
            path: fullInputPath,
        } );

        // Write bundle
        this.writeFile( fullOutputPath, this.files[ fullInputPath ] );

        // Cleanup
        this.files = {};

    }

    /**
     * Resolve a reference
     *
     * @param   reference - Reference
     */
    private resolveReference( reference: JSONReference ): void {

        // Read the referenced file (if if has not yet happened already)
        if ( !this.files[ reference.path ] ) {
            this.files[ reference.path ] = this.readFile( reference.path );
        }

        // If a location is missing, use the top level object
        if ( !reference.location ) {
            reference.location = this.files[ reference.path ];
        }

        // Get and references
        const innerReferences: Array<JSONReference> = this.findReferences( this.files[ reference.path ], reference.path );
        innerReferences.forEach( ( innerReference: JSONReference ): void => {

            // Resolve inner references first (deeply recursive)
            this.resolveReference( innerReference );

            // Merge reference content into the reference location - while always prefering the 'higher reference' content
            assignDeep( innerReference.location, this.files[ innerReference.path ], assignDeep( {}, innerReference.location ) );

        } );

    }

    /**
     * Find references within an object, located at the given base path
     *
     * @param   value    - Current value in the object to find references in
     * @param   filePath - Path of the current file, used to resolve the reference path
     * @returns          - List of references
     */
    private findReferences( value: any, filePath: string ): Array<JSONReference> {

        const references: Array<JSONReference> = [];

        // Handle objects (this includes arrays)
        if ( value instanceof Object ) {
            Object
                .keys( value ) // Works for arrays as well
                .forEach( ( key: string ): void => {

                    // Check if reference
                    if ( key.toLowerCase().trim() === '$ref' ) {

                        // Save reference
                        references.push( {
                            path: this.resolveReferencePath( value[ key ], filePath ), // Full path
                            location: value
                        } );

                        // Delete reference itself
                        delete value[ key ];

                    }

                    // Continue searching (deeply recursive)
                    references.push( ...this.findReferences( value[ key ], filePath ) );

                } );
        }

        return references;

    }

    /**
     * Resolve reference path
     *
     * @param   referencePath - Path to the reference
     * @param   filePath      - Current file path
     * @returns               - Actual (resolved) path to the reference
     */
    private resolveReferencePath( referencePath: string, filePath: string ): string {
        return referencePath[ 0 ] === '~'
            ? path.resolve( process.cwd(), 'node_modules', referencePath.substring( 1 ) )
            : path.resolve( path.dirname( filePath ), referencePath );
    }

    /**
     * Read JSON file
     *
     * @param filePath - Path (already resolved)
     */
    private readFile( filePath: string ): any {
        const fileContent: string = fs.readFileSync( filePath, 'utf-8' );
        const fileContentParsed: any = path.extname( filePath ) === '.json5'
            ? JSON5.parse( fileContent )
            : JSON.parse( fileContent );
        return fileContentParsed;
    }

    /**
     * Write JSON file
     *
     * @param filePath - Path (already resolved)
     * @param content  - File content
     */
    private writeFile( filePath: string, content: any ): void {
        const preparedContent: string = `${ JSON.stringify( content, null, '    ' ) }\n`;
        fsExtra.outputFileSync( filePath, preparedContent, 'utf-8' );
    }

}
