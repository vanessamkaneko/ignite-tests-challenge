import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create deposits and withdraws", () => {
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it("should be able to create a deposit", async () => {
    const user: ICreateUserDTO = {
      name: "User Deposit",
      email: "user@deposit.com",
      password: "123456"
    }

    const newUser = await createUserUseCase.execute(user)

    const transaction: ICreateStatementDTO = {
      user_id: newUser.id,
      description: "deposit",
      amount: 100,
      type: OperationType.DEPOSIT
    }

    const deposit = await createStatementUseCase.execute(transaction)

    expect(deposit).toHaveProperty("id")
  })

  it("should be abe to create a withdraw", async () => {
    const user: ICreateUserDTO = {
      name: "User Withdraw",
      email: "user@withdraw.com",
      password: "123456"
    }

    const newUser = await createUserUseCase.execute(user)

    const depositTransaction: ICreateStatementDTO = {
      user_id: newUser.id,
      description: "deposit",
      amount: 200,
      type: OperationType.DEPOSIT
    }

    await createStatementUseCase.execute(depositTransaction)

    const withdrawTransaction: ICreateStatementDTO = {
      user_id: newUser.id,
      description: "withdraw",
      amount: 100,
      type: OperationType.WITHDRAW
    }

    const withdraw = await createStatementUseCase.execute(withdrawTransaction)

    expect(withdraw).toHaveProperty("id")
  })

  it("should not be able to create a statement with incorrect user id", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User",
        email: "user@test.com",
        password: "123456"
      }

      await createUserUseCase.execute(user)

      await createStatementUseCase.execute({
        user_id: "noId",
        description: "deposit",
        amount: 200,
        type: OperationType.DEPOSIT
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("should not be able to create a withdraw with insufficient funds", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User",
        email: "user@test.com",
        password: "123456"
      }

      const newUser = await createUserUseCase.execute(user)

      const deposit: ICreateStatementDTO = {
        user_id: newUser.id,
        description: "deposit",
        amount: 150,
        type: OperationType.DEPOSIT
      }

      await createStatementUseCase.execute(deposit)

      const withdraw: ICreateStatementDTO = {
        user_id: newUser.id,
        description: "withdraw",
        amount: 200,
        type: OperationType.WITHDRAW
      }

      await createStatementUseCase.execute(withdraw)
      
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})