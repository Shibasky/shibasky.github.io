document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Robusta Arab', img: '1.jpg', price: 20000 },
            { id: 2, name: 'Arabica Blend', img: '1.jpg', price: 25000 },
            { id: 3, name: 'Primo Passo', img: '1.jpg', price: 30000 },
            { id: 4, name: 'Aceh Gayo', img: '1.jpg', price: 35000 },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // Cek apkah ada barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // Jika cart masih kosong
            if (!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // Jika barang sudah ada, cek apakah barang beda atau sama dnegan ada yg di cart
                this.items = this.items.map((item) => {
                    // Jika barang beda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // Jika barang sudah ada, tambah quantity & totalnya
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
            console.log(this.total);
        },

        remove(id) {
            // Item yang mau di remove berdasarkan id
            const cartItem = this.items.find((item) => item.id === id);

            // Jika item lebih dari satu
            if (cartItem.quantity > 1) {
                // Telusur item satu persatu
                this.items = this.items.map((item) => {
                    // Jika bukan barang yang diklik
                    if (item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                // Jika barang sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        }
    });

});

// Form validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');
form.addEventListener('keyup', function () {
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
})

// Kirim data ketika tombol checkout di klikR
checkoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data).items;
    console.log(objData);

});



// Konversi ke rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};