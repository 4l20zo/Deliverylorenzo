import Image from "next/image";
import Layout from "../../components/Layout";
import { client, urlFor } from "../../lib/client";
import css from '../../styles/Pizza.module.css';
import LeftArrow from '../../assets/arrowLeft.png';
import RightArrow from '../../assets/arrowRight.png';
import { useState, useEffect } from "react";
import { useStore } from "../../store/store";
import toast, { Toaster } from "react-hot-toast";


export default function Pizza({ pizza }) {
    const src = urlFor(pizza.image).url()

    //const [Quantity, setQuantity] = useState(1)
    const [Size, setSize] = useState(1)

    const addPizza = useStore((state) => state.addPizza)
    const addToCart = () => {
        const items = products.filter(product => product.quantity > 0)
        addPizza({pizza: {...pizza, price: pizza.price[Size], quantity: 1, size: 1, name: pizza.name, items}});
        toast.success("Added to Cart")
    }

    const [products, setProducts] = useState([
        { name: "item1 ", price: 10, quantity: 0, id: 1 },
        { name: "item2 ", price: 20, quantity: 0, id: 2 },
        { name: "item3 ", price: 30, quantity: 0, id: 3 }
    ]);

    let itemsTotal = products.reduce((a, item) => a + item.price * item.quantity, 0);

    const renderItems = () => {

        return products.map((product, index) => {
            const [quantity, setQuantity] = useState(product.quantity);
            useEffect(() => {
                const updatedProduct = {...product, quantity};
                const newProducts = [...products];
                newProducts[index] = updatedProduct;
                setProducts(newProducts)
            }, [quantity])
    


            const handleQuan = (type) => {
                if (type === "dec" && quantity === 0) {
                    return;
                }
                type === 'inc'
                    ? setQuantity(quantity + 1)
                    : setQuantity(quantity - 1);
            };
            // ...
            return (
                <li key={index}>
                    <div>Name: {product.name}</div>
                    <div><span style={{ color: 'var(--themeRed)' }}>$</span> {product.price}</div>
                    <div className={css.quantity}>
                        <span>Quantity</span>
                        <div className={css.counter}>
                            <Image src={LeftArrow} height={20} width={20} alt="" unoptimized priority objectFit="contain"
                                onClick={() => handleQuan("dec")} />
                            <span>{quantity}</span>
                            <Image src={RightArrow} height={20} width={20} alt="" unoptimized priority objectFit="contain"
                                onClick={() => handleQuan("inc")} />
                        </div>
                    </div>
                </li>
            );
        });
    }
    

    return (
        <Layout>

            {/**left side */}
            <div className={css.container}>
                <div className={css.ImageWrapper}>
                    <Image
                        loader={() => src}
                        src={src} alt="" layout="fill" unoptimized objectFit="cover" />
                </div>

                {/**right side */}
                <div className={css.right}>
                    <span>{pizza.name}</span>
                    <span>{pizza.details}</span>
                    <span><span style={{ color: 'var(--themeRed)' }}>$</span>{pizza.price[Size]} + <span style={{ color: 'var(--themeRed)' }}>$</span> {itemsTotal}</span>

                    {/**quantity counter */}

                    <div className={css.quantity}>
                        <span>Quantity</span>
                        <div className={css.counter}>
                            {renderItems()}
                        </div>
                    </div>
                    {/**button */}
                    <div className={`btn ${css.btn}`} onClick={addToCart}>
                        Add to Cart
                    </div>
                </div>
                <Toaster />
            </div>
        </Layout>
    );
}

export async function getStaticPaths() {
    const paths = await client.fetch(
        `*[_type =="pizza" && defined(slug.current)][].slug.current`
    );


    return {
        paths: paths.map((slug) => ({ params: { slug } })),
        fallback: "blocking",
    };
}


export async function getStaticProps(context) {
    const { slug = "" } = context.params;
    const pizza = await client.fetch(
        `*[_type=="pizza" && slug.current == '${slug}'][0]`
    );

    return {
        props: {
            pizza,
        },
    };
}
