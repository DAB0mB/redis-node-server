import * as fs from 'fs';
import * as resp from './resp';

const testData = fs.readFileSync(require.resolve('./docs.resp')).toString();

console.log(resp.parseMessage(testData));
