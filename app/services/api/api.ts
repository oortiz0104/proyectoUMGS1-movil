/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { ApiConfig } from "./api.types"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async get(apiSrv: string, params?: any): Promise<any | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(apiSrv, params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "",
      },
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data = response.data
      const status = response.status

      return { kind: "ok", data, status }
    } catch (e) {
      if (__DEV__) {
        console.log(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async post(apiSrv: string, params?: any): Promise<any | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.post(apiSrv, params, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    try {
      const data = response.data
      const status = response.status

      return { kind: "ok", data, status }
    } catch (e) {
      if (__DEV__) {
        console.log(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
