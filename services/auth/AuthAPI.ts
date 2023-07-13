import { ErpFetch } from "@shopinvader/fetch";
import { AuthService } from "../AuthService";
export interface AuthAPIConfig {
  loginPage: string
  logoutPage: string
}
export class AuthAPIService extends AuthService {
  config: AuthAPIConfig
  constructor(provider: ErpFetch, config: AuthAPIConfig) {
    super(provider)
    this.config = config
  }
}