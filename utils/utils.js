import bcrypt from "bcrypt";

export async function hashPassword(password,hash) {
    const verif = await bcrypt.compare(password, hash);
    return verif
}