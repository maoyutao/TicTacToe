export const SUBMIT_USER_NAME = 'SUBMIT_USER_NAME'

export function submitUserName(userName: string) {
  return {
    type: SUBMIT_USER_NAME,
    payload: {
      user: userName,
    }
  }
}