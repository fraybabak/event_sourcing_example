import fs from 'fs';

import Event from './types/event.types';
import Snapshot from './types/snapshot.types';
export class EventStore {
  private events: Event[];
  private subscriptions: ((event: Event) => void)[];

  constructor() {
    this.events = [];
    this.subscriptions = [];
  }

  public publish(event: Event): void {
    event.id = this.events.length + 1; // Assign an event ID
    this.events.push(event);
    this.subscriptions.forEach((subscription) => subscription(event));
  }

  public subscribe(callback: (event: Event) => void): void {
    this.subscriptions.push(callback);
  }

  public getEvents(): Event[] {
    return this.events;
  }

  public takeSnapshot(aggregateId: string, aggregate: any): void {
    const snapshot = {
      id: aggregateId,
      state: aggregate,
    };

    fs.writeFileSync(`snapshot-${aggregateId}.json`, JSON.stringify(snapshot));
  }
  public restoreFromSnapshot<T extends object>(
    aggregateId: string,
    aggregate: T
  ): void {
    const snapshotFile = `snapshot-${aggregateId}.json`;

    if (fs.existsSync(snapshotFile)) {
      const snapshotData = fs.readFileSync(snapshotFile, 'utf-8');
      const snapshot: Snapshot = JSON.parse(snapshotData);

      Object.assign(aggregate, snapshot.state);
      console.log('Restored from snapshot');
    } else {
      console.log('No snapshot found');
    }
  }
}
