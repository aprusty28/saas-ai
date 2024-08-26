import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";



const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        
        const {userId} = auth();
        const user = await currentUser();
        
        if (!userId || !user) {
            return new NextResponse("Unauthorized user", { status: 401})
        }

        const userSubscription = await prismadb.userSubscription.findUnique({
            where: {
                userId
            }
        })
    //when the user has subscription

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            console.log("plan upgraded")

            return new NextResponse(JSON.stringify({url: stripeSession.url}))
        }
    //when the user doesn't have any subscription
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "ChatGPT Pro",
                            description: "Unlimited AI Generations",
                        },
                        unit_amount: 20,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                }
            ],
            //to keep track of who actually subscribed 
            metadata: {
                userId,
            },
          
        })
        console.log("payment completed")
        return new NextResponse(JSON.stringify({url: stripeSession.url}))


    } catch (error) {
        console.log("STRIPE_ERROR", error)
        return new NextResponse("Internal error", { status: 500 });
    }
}