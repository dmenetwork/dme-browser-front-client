export const validateEmail = (email: string) => {
  const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/

  if (validEmail.test(email)) {
    return true
  } else {
    return false
  }
}

export const validatePassword = (
  pass: string,
  type: "CHAR" | "LOWERCASE" | "UPPERCASE" | "NUMBER"
) => {
  let res = false
  switch (type) {
    case "CHAR":
      res = pass.length >= 6 ? true : false
      break
    case "LOWERCASE":
      res = /[a-z]/.test(pass) ? true : false
      break
    case "UPPERCASE":
      res = /[A-Z]/.test(pass) ? true : false
      break
    case "NUMBER":
      res = /[0-9]/.test(pass) ? true : false
      break
  }
  return res
}
