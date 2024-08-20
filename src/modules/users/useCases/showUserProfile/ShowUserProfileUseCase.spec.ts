import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { User } from "@modules/users/entities/User";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show user's profile", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to get a profile by id", async () => {
    const user: ICreateUserDTO = {
      name: "User",
      email: "user@email.com",
      password: "456123"
    }

    const newUser = await createUserUseCase.execute(user)

    const userById = await showUserProfileUseCase.execute(newUser.id)

    expect(userById).toBeInstanceOf(User)
  })

  it("should not be able to get a profile of a nonexisting user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("noId")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})