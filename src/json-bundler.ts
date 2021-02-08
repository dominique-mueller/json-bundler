import * as assignDeep from 'assign-deep';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as JSON5 from 'json5';
import * as path from 'path';

import { JSONReference } from './json-reference.interface';

/**
 * JSON Bundler
 */
export class JSONBundler {
  /**
   * Paths
   */
  public get paths(): Array<string> {
    return Object.keys(this.files);
  }

  /**
   * Files with content, mutated while recursive bundling is happening
   */
  private files: { [path: string]: any };

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
  public bundle(inputPath: string, outputPath: string, minified = false): void {
    // Reset
    this.files = {};

    // Resolve paths
    const fullInputPath: string = path.resolve(inputPath);
    const fullOutputPath: string = path.resolve(outputPath);

    // Resolve references
    this.resolveReference({
      file: fullInputPath,
      path: fullInputPath,
    });

    // Write bundle
    this.writeFile(fullOutputPath, this.files[fullInputPath], minified);
  }

  /**
   * Resolve a reference
   *
   * @param   reference - Reference
   */
  private resolveReference(reference: JSONReference): void {
    // Read the referenced file (if if has not yet happened already)
    if (!this.files[reference.path]) {
      try {
        this.files[reference.path] = this.readFile(reference.path);
      } catch (error) {
        throw new Error(`${error.message}\nDetails: File is referenced in "${reference.file}".`);
      }
    }

    // If a location is missing, use the top level object
    if (!reference.location) {
      reference.location = this.files[reference.path];
    }

    // Get and references
    const innerReferences: Array<JSONReference> = this.findReferences(this.files[reference.path], reference.path);
    innerReferences.forEach((innerReference: JSONReference): void => {
      // Resolve inner references first (deeply recursive)
      this.resolveReference(innerReference);

      // Merge reference content into the reference location - while always prefering the 'higher reference' content
      assignDeep(innerReference.location, this.files[innerReference.path], assignDeep({}, innerReference.location));
    });
  }

  /**
   * Find references within an object, located at the given base path
   *
   * @param   value    - Current value in the object to find references in
   * @param   filePath - Path of the current file, used to resolve the reference path
   * @returns          - List of references
   */
  private findReferences(value: any, filePath: string): Array<JSONReference> {
    const references: Array<JSONReference> = [];

    // Handle objects (this includes arrays)
    if (value instanceof Object) {
      Object.keys(value) // Works for arrays as well
        .forEach((key: string): void => {
          // Check if reference
          if (key.toLowerCase().trim() === '$ref') {
            // Save reference
            references.push({
              file: filePath, // For error handling purposes only
              path: this.resolveReferencePath(value[key], filePath), // Full path
              location: value, // For merging
            });

            // Delete reference itself
            delete value[key];
          }

          // Continue searching (deeply recursive)
          references.push(...this.findReferences(value[key], filePath));
        });
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
  private resolveReferencePath(referencePath: string, filePath: string): string {
    return referencePath[0] === '~'
      ? path.resolve(process.cwd(), 'node_modules', referencePath.substring(1))
      : path.resolve(path.dirname(filePath), referencePath);
  }

  /**
   * Read JSON file
   *
   * @param   filePath - Path (already resolved)
   * @returns          - Parsed file content
   */
  private readFile(filePath: string): any {
    // Check supported file types
    const fileType: string = path.extname(filePath).toLowerCase();
    if (!(fileType === '.json' || fileType === '.json5')) {
      throw new Error(`The file "${filePath}" is not of type JSON / JSON5.`);
    }

    // Try to read the file
    let fileContent: string;
    try {
      fileContent = fs.readFileSync(filePath, 'utf-8');
    } catch (readFileError) {
      throw new Error(
        `An error occured while reading the file "${filePath}". [Code "${readFileError.code}", Number "${readFileError.errno}"]`,
      );
    }

    // Try to parse the file
    let fileContentParsed: string;
    try {
      fileContentParsed = fileType === '.json5' ? JSON5.parse(fileContent) : JSON.parse(fileContent);
    } catch (jsonParseError) {
      throw new Error(
        `An error occured while parsing the file "${filePath}" as ${fileType === '.json5' ? 'JSON5' : 'JSON'}. [${
          (<Error>jsonParseError).message
        }]`,
      );
    }

    return fileContentParsed;
  }

  /**
   * Write JSON file
   *
   * @param filePath - Path (already resolved)
   * @param content  - File content
   */
  private writeFile(filePath: string, content: any, minified: boolean): void {
    // Prepare content
    const preparedContent = `${JSON.stringify(content, null, minified ? '' : '    ')}\n`;

    // Try to write the file
    try {
      fsExtra.outputFileSync(filePath, preparedContent, 'utf-8');
    } catch (writeFileError) {
      throw new Error(
        [`An error occured while writing the file "${filePath}". [Code "${writeFileError.code}", Number "${writeFileError.errno}"]`].join(
          '\n',
        ),
      );
    }
  }
}
