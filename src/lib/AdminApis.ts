import type { User } from "@/type/user"
import Axios from "./Axios"


function handleResponse(response: any) {
  return response.data
}

function handleError(error: any) {
  if (error.response) {
    throw new Error(error.response.data.message || "An error occurred")
  } else if (error.request) {
    throw new Error("No response from server. Please try again.")
  } else {
    throw new Error(error.message || "An error occurred")
  }
}


export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await Axios.get("/api/v1/superadmin/users")
    return handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}

export async function fetchUser(userId: string): Promise<User> {
  try {
    const response = await Axios.get(`/api/v1/superadmin/users/${userId}`)
    return handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}

export async function createUser(userData: any): Promise<User> {
  try {
    const response = await Axios.post("/api/v1/superadmin/users", userData)
    return handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}

export async function updateUser(userId: string, userData: any): Promise<User> {
  try {
    const response = await Axios.put(`/api/v1/superadmin/users/${userId}`, userData)
    return handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    const response = await Axios.delete(`/api/v1/superadmin/users/${userId}`)
    return handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}
