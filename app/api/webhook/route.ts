import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature, 
            process.env.STRIPE_WEBHOOK_SECRET!
        )
        console.log("event", event)
    } catch (error: any) {
        console.log("error", error)

        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400});
    }

    // catching events for cancelled subscription and create for the very first time

    const session = event.data.object as Stripe.Checkout.Session;
    //handling session when the user is newly subscribed
    if (event.type === "checkout.session.completed") {
        console.log("inside first if in webhook")
        const subscription = await stripe.subscriptions.retrieve( //retrieving the kind of subscription user has
            session.subscription as string
        );

        if(!session?.metadata?.userId) {
            return new NextResponse("User Id is required", {status: 400})
        }

        await prismadb.userSubscription.create({
            data: {
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            },
        })
    }

    //handling when the user is already subscribed and has upgraded or cancelled subscription

    if( event.type === "invoice.payment_succeeded") {
        console.log("inside second if in webhook")

        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        await prismadb.userSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            }
        })
    }

    return new NextResponse(null, {status: 200});

}