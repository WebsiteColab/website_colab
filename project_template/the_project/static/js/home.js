// Replace the existing code that defines the books array with an AJAX request

const bookContainer = document.getElementById("book-container");
const cartContainer = document.getElementById("cart-container");
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");


let cartItems = 0;
let lowerLimit = 0; // Set your lower limit
let upperLimit = 12; // Set your upper limit

async function fetchBooks() {
    try {
        
        const response = await fetch(`/api/books?lower_limit=${lowerLimit}&upper_limit=${upperLimit}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        bookContainer.innerHTML = '';

        const books = await response.json();
        while (bookContainer.firstChild) {
            bookContainer.removeChild(bookContainer.firstChild);
        }




        for (const book of books) {
            let bookEntry = document.createElement("div");
            bookEntry.className = "book-entry";

            bookEntry.innerHTML = `
                <img src="${book.image}" alt="${book.title}">
                <div class="ratings">
                    ${getStarRatingHTML(book.ratings)}
                </div>
                <p>${book.title}</p>
                <p>Price: ${book.price}</p>
                
                ${book.stock > 0 ? `<p>${book.stock} in stock</p>` : '<p class="availability">Out of Stock</p>'}
                ${book.stock > 0 ? '<button class="add-to-cart">Add to Cart</button>' : ''}
            `;

            const addToCartButton = bookEntry.querySelector(".add-to-cart");


            
            if (addToCartButton) {
                addToCartButton.addEventListener("click", () => {
                    if (book.stock > 0) {
                        addToCart(book)
                        async function addToCart(book) {
                            try {
                                const response = await fetch('/add_to_cart', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        image: book.image,
                                        stock: book.stock,
                                        ratings: book.ratings,
                                        price: book.price,
                                        title: book.title // Add the 'title' key to the JSON data
                                    })
                                });
                        
                                if (!response.ok) {
                                    throw new Error('Failed to add book to cart');
                                }
                        
                                const data = await response.json();
                                // console.log(data.message);
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        }
                        // Call fetchCartData to retrieve and display the cart data
                        fetchCartData(bookEntry);
                        cartItems++;
                        cartCount.textContent = cartItems;
                        book.stock--;
                        if (book.stock === 0) {
                            bookEntry.querySelector(".availability").textContent = "Out of Stock";
                            addToCartButton.remove();
                        }
                    } else {
                        alert("This book is out of stock and cannot be added to the cart.");
                    }
                    // After adding to cart, update the cart display
                    updateCartDisplay();
                });
            }


            // async function addToCart(book) {
            //     try {
            //         const response = await fetch('/add_to_cart', {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             },
            //             body: JSON.stringify({
            //                 book_id: book.id,
            //                 title: book.title,
            //                 image: book.image,
            //                 ratings: book.ratings,
            //                 price: book.price
            //             })
            //         });
            
            //         if (!response.ok) {
            //             throw new Error('Failed to add book to cart');
            //         }
            
            //         const data = await response.json();
            //         console.log(data.message);
            //     } catch (error) {
            //         console.error('Error:', error);
            //     }
            // }









            // if (addToCartButton) {
            //     addToCartButton.addEventListener("click", () => {
            //         if (book.stock > 0) {

            //             cartItems++;
            //             cartCount.textContent = cartItems;
            //             book.stock--;
            //             if (book.stock === 0) {
            //                 bookEntry.querySelector(".availability").textContent = "Out of Stock";
            //                 addToCartButton.remove();
            //             }
            //         } else {
            //             alert("This book is out of stock and cannot be added to the cart.");
            //         }
            //     });
            // }

            bookContainer.appendChild(bookEntry);
        }

        // const next123 = document.createElement("div");
        // next123.id = "next-button";

        // const next123 = bookEntry.querySelector(".add-to-cart");
            // if (addToCartButton) {
            //     addToCartButton.addEventListener("click", () => {
            //         if (book.stock > 0) {
            //             cartItems++;
            //             cartCount.textContent = cartItems;
            //             book.stock--;
            //             if (book.stock === 0) {
            //                 bookEntry.querySelector(".availability").textContent = "Out of Stock";
            //                 addToCartButton.remove();
            //             }
            //         } else {
            //             alert("This book is out of stock and cannot be added to the cart.");
            //         }
            //     });
            // }

    } catch (error) {
        console.error('Error fetching book data:', error);
    }
}

function updateCartDisplay() {
    cartContainer.innerHTML = ''; // Clear the cart container

    // Fetch and display the updated cart items
    displayCart(cart); // Pass the cart array to displayCart
}

fetchBooks();

async function fetchCartData(bookEntry) {
    try {
        const response = await fetch('/cart_data');

        if (!response.ok) {
            throw new Error('Failed to fetch cart data');
        }

        const session_cart = await response.json();

        // Process the cart data as needed
        displayCart(session_cart, bookEntry);

        // Add event listener for "Delete from Cart" button
        const deleteButtons = document.querySelectorAll(".delete-from-cart");

        deleteButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const bookTitle = button.parentElement.querySelector("p").textContent;
                const book = { title: bookTitle }; // You may need additional data for identification
                removeFromCart(book, bookEntry);
            });
        });
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
}



function displayCart(cart, bookEntry) {
    cartContainer.innerHTML = ''; // Clear the cart container

    for (const book of cart) {
        const cartItem = document.createElement("div");
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <p>${book.title}</p>
            <p>Price: ${book.price}</p>
            <button class="delete-from-cart">Delete from Cart</button>
        `;

        const deleteButton = cartItem.querySelector(".delete-from-cart");

        if (deleteButton) {
            deleteButton.addEventListener("click", () => {
                removeFromCart(book, bookEntry);
            });
        }

        cartContainer.appendChild(cartItem);
    }
}


// Function to remove a book from the cart
async function removeFromCart(book, bookEntry) {
    try {
        const response = await fetch('/remove_from_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: book.title // Add any other necessary data for identification
            })
        });

        if (!response.ok) {
            throw new Error('Failed to remove book from cart');
        }

        const data = await response.json();
        // console.log(data.message);

        // Update the cart display after removing from the cart
        fetchCartData(bookEntry);
    } catch (error) {
        console.error('Error:', error);
    }
}




        // Function to generate star rating HTML
        function getStarRatingHTML(ratings) {
            const star = '<span class="star">&#9733;</span>';
            return star.repeat(ratings);
        }

        // Pagination
        //Define the current page and the total number of pages
        let currentPage = 1;
        const totalPages = 20; // Total number of pages we will have

        // Create "Next" button
const nextButton = document.createElement("button");
nextButton.id = "next-button";
nextButton.textContent = "Next";

// Create "Previous" button
const prevButton = document.createElement("button");
prevButton.id = "prev-button";
prevButton.textContent = "Previous";

// Append "Previous" and "Next" buttons to the container
const paginationWrapper = document.querySelector(".pagination-wrapper");
paginationWrapper.appendChild(prevButton);
paginationWrapper.appendChild(nextButton);

// Add event listeners for "Next" and "Previous" buttons
nextButton.addEventListener("click", () => {
    lowerLimit += 12;
    upperLimit += 12;
    fetchBooks();
});

prevButton.addEventListener("click", () => {
    if (lowerLimit >= 12) {
        lowerLimit -= 12;
        upperLimit -= 12;
        fetchBooks();
    }


const add_to_cart = document.createElement("button");
add_to_cart.className = "add-to-cart";
add_to_cart.addEventListener("click", () => {
        
        console.log('this is working')
    });
});