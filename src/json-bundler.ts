import * as fs from 'fs';
import * as path from 'path';

import * as deepmerge from 'deepmerge';
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
     * Reference symbol
     */
    private readonly referenceSymbol: string;

    /**
     * Constructor
     */
    constructor() {
        this.files = {};
        this.referenceSymbol = '$ref';
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
        this.findReferences( this.files[ reference.path ], path.dirname( reference.path ) )
            .forEach( ( reference: JSONReference ): void => {
                this.resolveReference( reference ); // Recursion
                deepmerge( reference.location, this.files[ reference.path ] );
            } );

    }

    /**
     * Find references within an object, located at the given base path
     *
     * @param   value    - Current value in the object to find references in
     * @param   basePath - Base path of the current file, used to resolve the reference path
     * @returns          - List of references
     */
    private findReferences( value: any, basePath: string ): Array<JSONReference> {

        const references: Array<JSONReference> = [];

        // Handle objects (and thus arrays as well)
        if ( value instanceof Object ) {
            Object
                .keys( value )
                .forEach( ( key: string ): void => {

                    // Save reference
                    if ( key.toLowerCase().trim() === this.referenceSymbol ) {
                        references.push( {
                            // TODO: Resolve path correctly (missing json ending, node_modules, hash sign)
                            path: path.resolve( basePath, value[ key ] ), // Full path
                            location: value
                        } );
                        delete value[ key ]; // Delete reference itself
                    }

                    // Continue searching (deeply recursive)
                    references.push( ...this.findReferences( value[ key ], basePath ) );

                } );
        }

        return references;

    }

    /**
     * Read JSON file
     *
     * @param filePath - Path (already resolved)
     */
    private readFile( filePath: string ): any {
        const fileContent: string = fs.readFileSync( filePath, 'utf-8' );
        const fileContentParsed: any = JSON.parse( fileContent );
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
