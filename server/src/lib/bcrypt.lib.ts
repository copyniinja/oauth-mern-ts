import bcrypt from "bcryptjs";

// hash a string
export async function hashString(value: string) {
  return await bcrypt.hash(value, 10);
}

// Compare value with  hashed value
export async function compareHashString(value: string, hashedValue: string) {
  return await bcrypt.compare(value, hashedValue);
}
