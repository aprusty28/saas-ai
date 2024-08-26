import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import { use } from "react";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const {userId} = auth();

    if (!userId) {
        return false
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
        where: {
            userId: userId
        },
        select: {
            stripeSubscriptionId: true,
            stripeCustomerId: true,
            stripeCurrentPeriodEnd: true,
            stripePriceId: true,
        }
    });

    if(!userSubscription) {
        return false;
    }

    const isValid = 
    userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now(); //giving one day grace period

    return !!isValid; //to ensure it returns a boolean value
}