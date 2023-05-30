import { BankAccount } from '../bankAccount';
import { EventStore } from '../eventStore';

describe('BankAccount', () => {
  let account: BankAccount;

  beforeEach(() => {
    account = new BankAccount('12345', 0, new EventStore());
  });

  test('should deposit the amount to the account balance', () => {
    account.deposit(100);
    expect(account.getState().balance).toBe(100);
  });

  test('should throw an error when withdrawing more than the account balance', () => {
    expect(() => account.withdraw(100)).toThrow('Insufficient funds');
  });
});
