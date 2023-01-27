import * as fs from 'fs';
import { RawMessage } from '.';

export default new RawMessage(fs.readFileSync(require.resolve('./docs.resp')).toString());
