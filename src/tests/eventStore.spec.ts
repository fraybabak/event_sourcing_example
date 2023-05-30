import fs from 'fs';
import { EventStore } from '../eventStore';

describe('EventStore', () => {
  let eventStore: EventStore;

  beforeEach(() => {
    eventStore = new EventStore();
  });

  test('should publish events and retrieve them', () => {
    const event1 = { id: 1, type: 'EVENT_1', amount: 100 };
    const event2 = { id: 2, type: 'EVENT_2', amount: 200 };

    eventStore.publish(event1);
    eventStore.publish(event2);

    const events = eventStore.getEvents();
    expect(events).toContainEqual(event1);
    expect(events).toContainEqual(event2);
  });

  test('should subscribe to events and invoke callback', () => {
    const event = { id: 1, type: 'EVENT', amount: 100 };
    const callback = jest.fn();

    eventStore.subscribe(callback);
    eventStore.publish(event);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(event);
  });

  test('should take a snapshot of aggregate', () => {
    const aggregateId = '12345';
    const aggregate = { id: aggregateId, balance: 100 };

    eventStore.takeSnapshot(aggregateId, aggregate);

    const snapshotFile = `snapshot-${aggregateId}.json`;
    expect(fs.existsSync(snapshotFile)).toBe(true);

    const snapshotData = fs.readFileSync(snapshotFile, 'utf-8');
    const snapshot = JSON.parse(snapshotData);

    expect(snapshot).toEqual({
      id: aggregateId,
      state: aggregate,
    });
  });

  test('should restore aggregate from snapshot', () => {
    const aggregateId = '12345';
    const aggregate = { id: aggregateId, balance: 100 };

    const snapshot = {
      id: aggregateId,
      state: aggregate,
    };

    const snapshotFile = `snapshot-${aggregateId}.json`;
    fs.writeFileSync(snapshotFile, JSON.stringify(snapshot));

    const newAggregate = {};
    eventStore.restoreFromSnapshot(aggregateId, newAggregate);

    expect(newAggregate).toEqual(aggregate);
  });
});
