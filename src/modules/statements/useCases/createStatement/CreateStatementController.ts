import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',  // http://localhost:3333/api/v1/statements/deposit
  WITHDRAW = 'withdraw', // http://localhost:3333/api/v1/statements/withdraw
  TRANSFERS = 'transfers' // http://localhost:3333/api/v1/statements/transfers/:user_id
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {

    const { user_id } = request.params // usuário destinatário
    const { id } = request.user; // usuário remetente

    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    // ['', 'api', 'v1', 'statements', 'deposit']
    // ['', 'api', 'v1', 'statements', 'withdraw']
    // ['', 'api', 'v1', 'statements', 'transfers', ':user_id']

    let type = splittedPath[splittedPath.length - 1] as OperationType; // pega último elemento do array (deposit, withdraw)

    const transfers = splittedPath[splittedPath.length - 2]
    
    if (transfers === OperationType.TRANSFERS) {
      type = transfers
    }

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id: id,
      user_dest: user_id,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
