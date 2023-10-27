import Stripe from "stripe";

const stripe = new Stripe(
    "sk_test_51MPJ9yFqeRnJj97Sl5na0BGIj7zfpzOZW2znql5DlYRfprz3hF8T6PpJHQ9medOcp2UPFvReXhOCTOpT8Vo7CYxY009WJyEWNC"
)

export default async function handler(req, res) {
    if (req.method == "POST") {
        try {
            const params = {
                submit_type: 'pay',
                mode: "payment",
                payment_method_types: ['card'],
                line_items: req.body.map((item) => {
                    const img = item.image.asset._ref;
                    const newImage = img
                        .replace(
                            "image-",
                            "https://cdn.sanity.io/images/vp1zc7ut/production/"
                        )
                        .replace("-jpg", ".jpg");

                    return {
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: item.name,
                                images: [newImage],
                            },
                            unit_amount: item.price * 100
                        },
                        adjustable_quantity: {
                            enabled: false,
                        },
                        quantity: item.quantity,
                    }
                }),
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/`
            };

            const session = await stripe.checkout.sessions.create(params);
            res.status(200).json(session)

        }
        catch (error) 
        {
            res.status(500).json(error.message)
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("method not allowed")
    }
}