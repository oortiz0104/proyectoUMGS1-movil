import { navigationRef } from "app/navigators"
import { load, remove } from "./storage"

const identity = "identity"
const token = "token"

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    load(identity)
      .then((res) => {
        if (res) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const signOut = async () => {
  await remove(identity)
  await remove(token)

  navigationRef.navigate("Login")
}

export const getToken = () => {
  return new Promise((resolve, reject) => {
    load(token)
      .then((res) => {
        if (res) {
          resolve(res)
        } else {
          resolve(null)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const getIdentity = (): any => {
  return new Promise((resolve, reject) => {
    load(identity)
      .then((res) => {
        if (res) {
          resolve(res)
        } else {
          resolve(null)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
