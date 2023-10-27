import create from 'zustand'

export const useStore = create(
    (set) => ({
        //cart
        cart: {
            pizzas: [],
        },

        // add pizza in cart
        addPizza: (data) => {
            set((state) => {
                return {
                    cart: {
                        pizzas: [...state.cart.pizzas, data.pizza],
                    }   
                }
            })
        },

        //remove cart

        removePizza: (index) => set((state) => ({
            cart: {
                pizzas: state.cart.pizzas.filter((_, i) => i != index),
            }
        })),
        resetCart: () =>
            set(() => ({
                cart: {
                    pizzas: [],
                }
            }))

    })
)