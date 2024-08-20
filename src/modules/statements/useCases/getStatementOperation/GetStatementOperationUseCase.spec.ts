import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("List an operation", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository;
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to get an operation by id", async () => {
    const user: ICreateUserDTO = {
      name: "User",
      email: "user@test.com",
      password: "123456"
    }

    const newUser = await createUserUseCase.execute(user)

    const deposit: ICreateStatementDTO = {
      user_id: newUser.id,
      description: "deposit",
      amount: 200,
      type: OperationType.DEPOSIT
    }

    const createDeposit = await createStatementUseCase.execute(deposit)

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: newUser.id,
      statement_id: createDeposit.id
    })

    expect(getStatement).toHaveProperty("id")
  })

  it("should not be able to find an statement operation with incorrect id", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User1",
        email: "user1@test.com",
        password: "123456"
      }

      const newUser = await createUserUseCase.execute(user)

      const deposit: ICreateStatementDTO = {
        user_id: newUser.id,
        description: "deposit",
        amount: 200,
        type: OperationType.DEPOSIT
      }

      await createStatementUseCase.execute(deposit)

      await getStatementOperationUseCase.execute({
        user_id: newUser.id,
        statement_id: "123132"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  
})