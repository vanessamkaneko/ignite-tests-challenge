import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {

  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Teste",
      email: "user@teste.com.br",
      password: "123456"
    });

    expect(user).toHaveProperty("id")
  });

  it("should not be able to create a new user with existing email", async () => {
    expect(async () => {
      const user = {
        name: "Teste Email",
        email: "email@teste.com.br",
        password: "123456"
      }

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
  
})
