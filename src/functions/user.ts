import { User } from "../types";

export function isAdmin(user: User) {
    if (!user || !user.roles) return false
    return !!user.roles.find(r => (r.name === "superadministrator" || r.name === "administrator"))
}