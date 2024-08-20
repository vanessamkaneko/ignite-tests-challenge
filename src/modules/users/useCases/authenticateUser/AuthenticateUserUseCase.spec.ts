import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "New User",
      email: "new@user.com",
      password: "123456"
    }

    await createUserUseCase.execute(user)

    const isAuthenticated: IAuthenticateUserResponseDTO = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(isAuthenticated).toHaveProperty("token")
  })

  it("should not be able to authenticate an nonexisting user", async () => {
    expect(async () => {
       await authenticateUserUseCase.execute({
        email: "wrong@email.com",
        password: "332211"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate an user with incorrect password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test User Password",
        email: "test@user.com",
        password: "123456"
      }

      await createUserUseCase.execute(user)

      const isAuthenticated: IAuthenticateUserResponseDTO = await authenticateUserUseCase.execute({
        email: user.email,
        password: "112233"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})