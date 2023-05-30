import { EventStore } from './eventStore';
import AccountState from './types/bankState.types';
import fs from 'fs';

export class BankAccount {
  private id: string;
  private balance: number;
  private eventStore: EventStore;

  constructor(id: string, initialBalance: number, eventStore: EventStore) {
    this.id = id;
    this.balance = initialBalance;
    this.eventStore = eventStore;
  }

  public deposit(amount: number): void {
    const event = { id: 0, type: 'DEPOSIT', amount };
    this.eventStore.publish(event);
    this.applyEvent(event);
    this.eventStore.takeSnapshot(this.id, this);
  }

  public withdraw(amount: number): void {
    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }

    const event = { id: 0, type: 'WITHDRAW', amount };
    this.eventStore.publish(event);
    this.applyEvent(event);
    this.eventStore.takeSnapshot(this.id, this);
  }

  public restoreFromSnapshot(): void {
    const snapshotFile = `snapshot-${this.id}.json`;

    if (fs.existsSync(snapshotFile)) {
      const snapshotData = fs.readFileSync(snapshotFile, 'utf-8');
      const snapshot = JSON.parse(snapshotData);

      this.balance = snapshot.state.balance;
    }
  }

  private applyEvent(event: any): void {
    switch (event.type) {
      case 'DEPOSIT':
        this.balance += event.amount;
        break;
      case 'WITHDRAW':
        this.balance -= event.amount;
        break;
      default:
        break;
    }
  }

  public getState(): AccountState {
    return { id: this.id, balance: this.balance };
  }
}
