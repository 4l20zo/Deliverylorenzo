import Image from "next/image";
import Layout from "../../components/Layout";
import { client, urlFor } from "../../lib/client";
import css from '../../styles/Pizza.module.css';
import LeftArrow from '../../assets/arrowLeft.png';
import RightArrow from '../../assets/arrowRight.png';
import { useState } from "react";
import { useStore } from "../../store/store";
import toast, { Toaster } from "react-hot-toast";


export default function Pizza({ pizza }) {
    const src = urlFor(pizza.image).url()

    const [Quantity, setQuantity] = useState(1)
    const [Size, setSize] = useState(1)

    {/*handle*/ }

    const handleQuan = (type) => {
        type === 'inc'
            ? setQuantity((prev) => prev + 1)
            : Quantity === 1
                ? null
                : setQuantity((prev) => prev - 1);
    };

    // add to cart function

    const addPizza = useStore((state) => state.addPizza)
    const addToCart = () => {
        addPizza({ ...pizza, price: pizza.price[Size], quantity: Quantity, size: Size, name: pizza.name })
        toast.success("Added to Cart")
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
                    <span><span style={{ color: 'var(--themeRed)' }}>$</span> {pizza.price[Size]}</span>
                    <div className={css.size}>
                        <span>Size</span>
                        <div className={css.sizeVariants}>
                            <div onClick={() => setSize(0)} className={Size === 0 ? css.selected : ""}>Small</div>
                            <div onClick={() => setSize(1)} className={Size === 1 ? css.selected : ""}>Medium</div>
                            <div onClick={() => setSize(2)} className={Size === 2 ? css.selected : ""}>Large</div>
                        </div>
                    </div>

                    {/**quantity counter */}

                    <div className={css.quantity}>
                        <span>Quantity</span>
                        <div className={css.counter}>
                            <Image src={LeftArrow} height={20} width={20} alt="" objectFit="contain"
                                onClick={() => handleQuan("dec")} />
                            <span>{Quantity}</span>
                            <Image src={RightArrow} height={20} width={20} alt="" objectFit="contain"
                                onClick={() => handleQuan("inc")} />
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


import React, { useState, useEffect } from 'react';

export default function Map() {
    const [origin, setOrigin] = useState({ lat: -29.682544, lng: -53.814122 });
    const [destination, setDestination] = useState('');
    const [distance, setDistance] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ address: "" });

    const handleInput = (name, value) => {
      setFormData({ ...formData, [name]: value });
    };
    useEffect(() => {
        const originInput = new google.maps.places.Autocomplete(document.getElementById('origin'));
        const destinationInput = new google.maps.places.Autocomplete(document.getElementById('destination'));
        originInput.setFields(['address_components', 'geometry', 'icon', 'name']);
        destinationInput.setFields(['address_components', 'geometry', 'icon', 'name']);

        const santaMariaBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-29.71606, -53.77159),
            new google.maps.LatLng(-29.64185, -53.71954)
        );
        destinationInput.setBounds(santaMariaBounds);

    }, []);


    const calculateDistance = () => {
        const service = new google.maps.DistanceMatrixService();
        const encodedDestination = encodeURIComponent(destination);
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [encodedDestination],
            travelMode: 'DRIVING',
        }, (response, status) => {
            if (status === 'OK') {
                const distance = response.rows[0].elements[0].distance.text;
                setDistance(`The distance between ${origin} and ${destination} is ${distance}.`);
            } else {
                setError(`Error: ${status}`);
            }
        });
    }




    return (
        <div>
            <div>
                {/*<input type="text" id="origin" onChange={(e) => setOrigin(e.target.value)} />*/}
            </div>
            <div>
                <input type="text" id="destination" onChange={(e) => setDestination(e.target.value)} />
            </div>
            <button onClick={calculateDistance}>Calculate Distance</button>
            {distance && <div id="result">{distance}</div>}
            {error && <div id="result">{error}</div>}
            <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC1Gr4wjiAL76cn7vLLQNrF1piib_6l0-o&libraries=places"></script>
        </div>
    );
}



import React, { useState, useEffect } from 'react';

export default function Map() {
    const [origin, setOrigin] = useState('Rua São José 350, Santa Maria, RS');
    const [destination, setDestination] = useState({});
    const [distance, setDistance] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const originInput = new google.maps.places.Autocomplete(document.getElementById('origin'));
        const destinationInput = new google.maps.places.Autocomplete(document.getElementById('destination'));
        originInput.setFields(['address_components', 'geometry', 'icon', 'name']);
        destinationInput.setFields(['address_components', 'geometry', 'icon', 'name']);
        originInput.addListener('place_changed', () => {
            const place = originInput.getPlace();
            setOrigin(place.formatted_address);
        });
        destinationInput.addListener('place_changed', () => {
            const place = destinationInput.getPlace();
            setDestination({ address: place.formatted_address, location: place.geometry.location });
        });
    }, []);

    const calculateDistance = () => {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination.formatted_address],
            travelMode: 'DRIVING',
        }, (response, status) => {
            if (status === 'OK') {
                const distance = response.rows[0].elements[0].distance.text;
                setDistance(`The distance between ${origin} and ${destination.formatted_address} is ${distance}.`);
            } else {
                setError(`Error: ${status}`);
            }
        });
    }
    

    return (
        <div>
            <div>
                <input type="text" id="origin" value={origin} disabled />
            </div>
            <div>
                <input type="text" id="destination" />
            </div>
            <button onClick={calculateDistance}>Calculate Distance</button>
            {distance && <div id="result">{distance}</div>}
            {error && <div id="result">{error}</div>}
            <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC1Gr4wjiAL76cn7vLLQNrF1piib_6l0-o&libraries=places"></script>
        </div>
    );
}



const Example = ({ destination }) => {
    const [address, setAddress] = useState(() => {
        const storedAddress = localStorage.getItem("address");
        return storedAddress ? storedAddress : destination;
    });

    useEffect(() => {
        localStorage.setItem("address", address);
        console.log(address)
    }, [address]);

};





Querida [nome da namorada],

Você é o maior presente que eu poderia pedir. Todos os dias eu acordo e me sinto grato por ter você em minha vida. Sei que nem sempre consigo expressar todo mu amor por voc, mas você realmente significa o universo para mim. Você trouxe tanta luz e felicidade para minha vida, e não consigo imaginar como seria a vida sem você.

Obrigado por tudo, sempre vou te amar e valorizar e fazer tudo ao meu alcance para que você se sinta amada e apreciada todos os dias.

Com todo o meu amor,

[Seu nome]''