import { useCartStore } from "./useCartStore";

describe("useCartStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({ cart: [], isCartOpen: false });
  });

  it("should initialize with an empty cart", () => {
    const state = useCartStore.getState();
    expect(state.cart).toEqual([]);
    expect(state.isCartOpen).toBe(false);
  });

  it("should clear the cart", () => {
    useCartStore.setState({
      cart: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
          quantity: 1,
          category: "Apparel",
          image: "/img.jpg",
          description: "",
          details: [],
          isNew: false
        }
      ]
    });

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().cart).toEqual([]);
  });
});
