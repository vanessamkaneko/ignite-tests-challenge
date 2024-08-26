import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'user_dest' |
  'description' |
  'amount' |
  'type'
>
