import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get balance", () => {
  beforeAll(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
  })

  it("should be able to list all transfers operation and total balance", async () => {
    const user: ICreateUserDTO = {
      name: "First User",
      email: "user@test.com",
      password: "789456"
    }

    const newUser = await createUserUseCase.execute(user)

    const depositTransaction: ICreateStatementDTO = {
      user_id: newUser.id,
      description: "deposit",
      amount: 200,
      type: OperationType.DEPOSIT
    }

    const withdrawTransaction: ICreateStatementDTO = {
      user_id: newUser.id,
      description: "withdraw",
      amount: 50,
      type: OperationType.WITHDRAW
    }

    await createStatementUseCase.execute(depositTransaction)
    await createStatementUseCase.execute(withdrawTransaction)

    const balance = await getBalanceUseCase.execute({
      user_id: newUser.id
    })

    expect(balance.balance).toBe(150)
  })

  it("should not be able to get balance account of a nonexisting user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "12121"
      })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})