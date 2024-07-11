// script.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('products.csv')
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                complete: function(results) {
                    const groupedProducts = groupByHandle(results.data);
                    displayProducts(groupedProducts);
                }
            });
        })
        .catch(error => console.error('Error fetching CSV file:', error));
});

function groupByHandle(data) {
    const grouped = {};
    data.forEach(product => {
        if (!grouped[product.Handle]) {
            grouped[product.Handle] = {
                ...product,
                images: []
            };
        }
        grouped[product.Handle].images.push(product['Image Src']);
    });
    return Object.values(grouped);
}

function displayProducts(products) {
    const productCatalogue = document.getElementById('productCatalogue');
    productCatalogue.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        
        const swiperContainer = document.createElement('div');
        swiperContainer.classList.add('swiper-container');
        
        const swiperWrapper = document.createElement('div');
        swiperWrapper.classList.add('swiper-wrapper');
        
        product.images.forEach(src => {
            if (src) {
                const swiperSlide = document.createElement('div');
                swiperSlide.classList.add('swiper-slide');
                const productImage = document.createElement('img');
                productImage.src = src;
                swiperSlide.appendChild(productImage);
                swiperWrapper.appendChild(swiperSlide);
            }
        });

        swiperContainer.appendChild(swiperWrapper);
        productElement.appendChild(swiperContainer);
        
        const productTitle = document.createElement('div');
        productTitle.classList.add('product-title');
        productTitle.textContent = product['Title'];
        productElement.appendChild(productTitle);
        
        const productPrice = document.createElement('div');
        productPrice.classList.add('product-price');
        productPrice.textContent = '$' + product['Variant Price'];
        productElement.appendChild(productPrice);
        
        productCatalogue.appendChild(productElement);
        
        new Swiper(swiperContainer, {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    });
}
