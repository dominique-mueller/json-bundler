export * from './src/json-bundler';

import { JSONBundler } from './src/json-bundler';

const jsonBundler = new JSONBundler().bundle( './test/entry.json', './dist/result.json' );
