import { useStore } from "../store/store";
import Layout from "../components/Layout";
import Image from "next/image";
import { urlFor } from "../lib/client";
import css from '../styles/Cart.module.css'
import toast, { Toaster } from "react-hot-toast";
import OrderModal from "../components/OrderModal";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { createOrder } from "../lib/orderHandler";
import DistanceMatrixExample from "./maps";



export default function Cart() {

    const [entrega, setEntrega] = useState('');
    const initialDeliveryPrice = typeof localStorage !== 'undefined' ? Number(localStorage.getItem('deliveryPrice')) || 0 : 0;

    const [deliveryPrice, setDeliveryPrice] = useState(initialDeliveryPrice);

    useEffect(() => {
        const storedDeliveryPrice = Number(localStorage.getItem('deliveryPrice'));
        if (storedDeliveryPrice !== deliveryPrice) {
            setDeliveryPrice(storedDeliveryPrice || 0);
        }
    }, [deliveryPrice]);



    let totalValue;
    const total = () => {
        totalValue = CartData.pizzas.reduce((acc, pizza) => {
            // calculate total for pizza
            const pizzaTotal = pizza.quantity * pizza.price;
            // calculate total for items
            const itemsTotal = pizza.items.reduce((a, item) => a + item.quantity * item.price, 0);
            return acc + pizzaTotal + itemsTotal + deliveryPrice;
        }, 0);
        if (typeof window !== 'undefined') {
            localStorage.setItem('total', totalValue);
        }
        return totalValue;
    }

    const [FormData, setFormData] = useState({})

    const handleInput = (e) => {
        setFormData({ ...FormData, [e.target.name]: e.target.value })
    }

    const resetCart = useStore((state) => state.resetCart);

    const handleSubmit = async (e) => {
        PaymentMethod = 0;
        const total = typeof window !== "undefined" && localStorage.getItem('total')
        const address = typeof window !== "undefined" && localStorage.getItem('address')
        e.preventDefault();
        const id = await createOrder({ ...FormData, total, PaymentMethod, pizzaJSON, address })
        toast.success("Order Placed");
        resetCart();
        {
            typeof window !== 'undefined' && localStorage.setItem('order', id)
        }

        router.push(`/order/${id}`)
    }

    const CartData = useStore((state) => state.cart)
    const removePizza = useStore((state) => state.removePizza)
    {/*console.log(CartData)*/ }
    const [Order, setOrder] = useState(
        typeof window !== 'undefined' && localStorage.getItem('order')
    )

    const [PaymentMethod, setPaymentMethod] = useState(null)


    const handleRemove = (i) => {
        removePizza(i);
        toast.error('Item Removed');
    };

    const router = useRouter()


    var arr = [CartData]
    const pizzas = arr[0].pizzas.map(pizza => ({
        name: pizza.name,
        items: pizza.items.map(item => ({ name: item.name, quantity: item.quantity }))
    }));
    const pizzaJSON = JSON.stringify(pizzas);
    {/*    console.log(pizzaJSON)*/ }
    typeof window !== 'undefined' && localStorage.setItem('pizzasname', pizzaJSON)




    const handleCheckout = async () => {
        typeof window !== 'undefined' && localStorage.getItem('total', total())
        typeof window !== 'undefined' && localStorage.getItem('pizzasname')
        typeof window !== 'undefined' && localStorage.getItem('address')

        setPaymentMethod(1);
        const response = await fetch('api/stripe/', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(CartData.pizzas)
        });

        if (response.status === 500) return;
        const data = await response.json();
        toast.loading("redirecting...");
        router.push(data.url)
    }

    return (
        <Layout>
            {CartData.pizzas.length > 0
                ? (
                    <div>
                        <div className={css.container}>
                            {/**details */}
                            <div className={css.details}>

                                <table className={css.table}>
                                    <thead>
                                        <tr>

                                            <th>Pizza</th>
                                            <th>Name</th>
                                            <th>Adicionais</th>
                                            <th>Size</th>
                                            <th>Price</th>
                                            <th>Total Adicionais</th>
                                            <th>Total</th>
                                            <th> </th>
                                        </tr>
                                    </thead>
                                    <tbody className={css.tbody} >
                                        {CartData.pizzas.length > 0 &&
                                            CartData.pizzas.map((pizza, i) => {
                                                const src = urlFor(pizza.image).url()
                                                const itemsTotal = pizza.items.reduce((a, item) => a + item.quantity * item.price, 0);
                                                return (
                                                    < tr key={i} >

                                                        <td className={css.imageTd}>
                                                            <Image loader={() => src}
                                                                src={src}
                                                                alt="" objectFit="cover" width={85} height={85} />
                                                        </td>

                                                        <td> {pizza.name}</td>

                                                        <td> {pizza.items.map(item => item.name)}</td>

                                                        <td>
                                                            {pizza.Size === 0 ?
                                                                "Small" :
                                                                pizza.size === 1 ?
                                                                    "Medium" :
                                                                    "Large"}
                                                        </td>

                                                        <td>{pizza.price}</td>

                                                        <td>{itemsTotal}</td>

                                                        <td>{pizza.price + itemsTotal}</td>
                                                        <td style={{ color: "var(--themeRed)", cursor: 'pointer' }} onClick={() => handleRemove(i)}>X</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                            </div>
                            {/**summary */}
                            <div className={css.cart}>
                                <span>Cart</span>
                                <div className={css.CartDetails}>

                                    <div >
                                        <span>Items</span>
                                        <span>{CartData.pizzas.length}</span>
                                    </div>

                                    <div >
                                        <span>Total</span>
                                        <span>$ {total()}</span>
                                    </div>

                                </div>
                                <div>

                                    <form onSubmit={handleSubmit} className={css.formContainer}>
                                        <div className={css.inputt}>
                                            Nome:<input onChange={e => {
                                                localStorage.setItem("name", e.target.value);
                                                handleInput(e);
                                            }} type="text" name="name" required placeholder="name" />
                                            Telefone:<input onChange={e => {
                                                localStorage.setItem("phone", e.target.value);
                                                handleInput(e);
                                            }} type="text" name="phone" required placeholder="phone number" />
                                            {/*Endereço:<textarea onChange={e => {
                                        localStorage.setItem("address", e.target.value);
                                        handleInput(e);
                                    }} name="address" rows={3} required placeholder="address"></textarea>*/}
                                        </div>

                                    </form>
                                    <Toaster />
                                    <></>
                                    <div className={css.buttons}>
                                        <button className="btn" onClick={() => setEntrega(0)}>Retirada na Pizzaria</button>
                                        <button className="btn" onClick={() => setEntrega(1)}>Tele-Entrega</button>
                                    </div>
                                </div>
                                {entrega === 0
                                    ? (
                                        !Order && CartData.pizzas.length > 0
                                            ? (
                                                <div className={css.buttons}>
                                                    <button className="btn" onClick={handleSubmit} type="submit">Pagar na Pizzaria</button>
                                                    <button className="btn" onClick={handleCheckout} type="submit">Pagar Agora</button>
                                                </div>
                                            ) : null
                                    ) : null}

                                {entrega === 1
                                    ? (
                                        !Order && CartData.pizzas.length > 0
                                            ? (
                                                <div> <DistanceMatrixExample />
                                                    <div className={css.buttons}>
                                                        <button className="btn" onClick={handleSubmit} type="submit">Pay on Delivery</button>
                                                        <button className="btn" onClick={handleCheckout} type="submit">Pay Now</button>
                                                    </div>
                                                </div>
                                            ) : null
                                    ) : null}


                            </div>
                        </div>
                        <Toaster />
                        {/*modal*/}
                        {/*<OrderModal opened={PaymentMethod === 0}
                setOpened={setPaymentMethod}
                PaymentMethod={PaymentMethod} />*/}

                    </div>
                ) :
                <div>
                    <div className={css.container}>Seu Carrinho está vazio
                    </div>
                </div>
            }

        </Layout>

    )
};
