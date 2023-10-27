import { Modal, useMantineTheme } from "@mantine/core"
import css from '../styles/OrderModal.module.css'
import { useEffect, useRef, useState } from "react";
import { createOrder } from "../lib/orderHandler";
import { toast, Toaster } from "react-hot-toast";
import { useStore } from "../store/store";
import { useRouter } from "next/router";

export default function OrderModal({ opened, setOpened, PaymentMethod }) {
    const theme = useMantineTheme();

    const router = useRouter();

    const [FormData, setFormData] = useState({})

    const handleInput = (e) => {
        setFormData({ ...FormData, [e.target.name]: e.target.value })
    }

    const resetCart = useStore((state) => state.resetCart);

    const total = typeof window !== "undefined" && localStorage.getItem("total")

    const pizzaJSON = typeof window !== "undefined" && localStorage.getItem("pizzasname")

    const name = typeof window !== "undefined" && localStorage.getItem("name")

    const phone = typeof window !== "undefined" && localStorage.getItem("phone")

    const address = typeof window !== "undefined" && localStorage.getItem("address")



    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = await createOrder({ ...FormData, total, PaymentMethod, pizzaJSON, name, phone, address })
        toast.success("Order Placed");
        resetCart();
        {
            typeof window !== 'undefined' && localStorage.setItem('order', id)
        }

        router.push(`/order/${id}`)
    }


    return (
        <Modal
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.55}
            overlayBlur={3}
            opened={opened}
            onClose={() => setOpened(null)}>
            {/* Modal content */}
            <form onSubmit={handleSubmit} className={css.formContainer}>

                <span>Nome: <span>{name}</span></span>
                <span>Telefone: <span>{phone}</span></span>
                <span>Endereço: <span>{address}</span></span>
                <span>Pagar <span>$ {total}</span> no Delivery</span>
                <button typeof="submit" className="btn">Criar ordem...</button>
            </form>
            <Toaster />
        </Modal>

    )
};