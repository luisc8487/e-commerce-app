const layout = require("../layout");

module.exports = ({products}) => {
  const renderProducts = products
    .map((product) => {
      return `
                <h2>${product.title}</h2>
                <p>${product.price}</p>
        `;
    })
    .join("");
  return layout({
    content: `
            <h1 class="title">Products</h1>
            ${renderProducts}
        `,
  });
};
