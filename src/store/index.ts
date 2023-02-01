import { resolve } from 'path';
import { writeError, writeLog } from '~/utils/console';
import { ActivityRecorder } from './activity_recorder';
import { DataRecorder } from './data_recorder';
import { GarbageCollector } from './garbage_collector';
import { Store } from './store';

const activityFile = resolve(process.env.ACTIVITY_FILE || './activity.jsonl');
const dataFile = resolve(process.env.DATA_FILE || './data.jsonl');
const dataRecordInterval = Number(process.env.DATA_RECORD_INTERVAL || '60');

export const store = new Store();
export const activityRecorder = new ActivityRecorder(store, activityFile);
export const dataRecorder = new DataRecorder(store, dataFile, dataRecordInterval);
export const garbageCollector = new GarbageCollector(store);

export async function initStore() {
  try {
    await dataRecorder.load();
    const anyActivities = !!await activityRecorder.load();
    if (anyActivities) {
      await dataRecorder.save();
      await activityRecorder.clear();
    }
  }
  catch (e) {
    writeError('Failed to recover store data', e);
    process.exit(1);
  }

  dataRecorder.events.on('save', async () => {
    try {
      await activityRecorder.clear();
    }
    catch (e) {
      writeError('Failed to clear activity log', e);
    }
  });

  dataRecorder.events.on('recorded', () => {
    writeLog('Data recorded');
  });

  dataRecorder.events.on('record:error', (e) => {
    writeError('Data record error', e);
  });

  activityRecorder.start();
  dataRecorder.start();
  garbageCollector.start();
}
