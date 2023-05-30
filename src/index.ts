import { EventStore } from './eventStore';
import { BankAccount } from './bankAccount';

// Event Store instance
const eventStore = new EventStore();

// Bank Account instance
const account = new BankAccount('12345', 0, eventStore);

// Restore from snapshot if available
account.restoreFromSnapshot();

// Subscribe to events
eventStore.subscribe((event) => {
  console.log('New event:', event);
});

// Perform operations on the bank account
account.deposit(100);
account.withdraw(50);
account.deposit(75);

// Get all events from the event store
console.log('All events:', eventStore.getEvents());

// Get current state
console.log('Current state:', account.getState());
