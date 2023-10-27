import { urlFor } from '../lib/client'
import css from '../styles/Menu.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from "react";
import { useStore } from "../store/store";
import toast, { Toaster } from "react-hot-toast";

export default function Menu({ pizzas }) {


    return (
        <div className={css.container}>

            {/*pizzas */}

            <div className={css.menu}>
                {pizzas.map((pizza, id) => {
                    const src = urlFor(pizza.image).url()

                    return (
                        <div className={css.pizza} key={id}>

                            <Link href={`./pizza/${pizza.slug.current}`}>

                                <   div className={css.ImageWrapper}>
                                    <Image
                                        priority
                                        unoptimized
                                        loader={() => src}
                                        src={src} alt="" objectFit='cover' layout='fill' />
                                </div>
                            </Link>


                            <span>{pizza.name}</span>
                            <span><span style={{ color: 'var(--themeRed)' }}>$</span> {pizza.price[1]}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
