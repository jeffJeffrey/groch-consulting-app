import { Patient } from "../types";
import { strToDate } from "./dates";

export function getValidPackage(p: Patient) {
    if (!p || !p.subscriptions || p.subscriptions?.length <= 0) return;
    const subs = p.subscriptions.find((s) => {
        return new Date() <= strToDate(s.limitDate)
    });
    return subs;
}

export * from "./user"