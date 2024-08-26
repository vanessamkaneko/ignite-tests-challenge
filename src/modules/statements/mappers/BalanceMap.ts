import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      user_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => {

      const statementInfo = {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }

      if(type === 'transfers') statementInfo['sender_id'] = user_id

      return statementInfo
  });

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
