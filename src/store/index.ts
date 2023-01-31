import { resolve } from 'path';
import { error, log } from 'src/console';
import { ActivityRecorder } from './activity_recorder';
import { DataRecorder } from './data_recorder';
import { GarbageCollector } from './garbage_collector';
import { Store } from './store';

const activityFile = process.env.ACTIVITY_FILE || resolve(process.cwd(), 'activity.log');
const dataFile = process.env.DATA_FILE || resolve(process.cwd(), 'data.json');
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
    error('Failed to recover store data', e);
    process.exit(1);
  }

  dataRecorder.events.on('save', async () => {
    try {
      await activityRecorder.clear();
    }
    catch (e) {
      error('Failed to clear activity log', e);
    }
  });
  
  dataRecorder.events.on('recorded', () => {
    log('Data recorded');
  });
  
  dataRecorder.events.on('record:error', (e) => {
    error('Data record error', e);
  });

  activityRecorder.start();
  dataRecorder.start();
  garbageCollector.start();
}
