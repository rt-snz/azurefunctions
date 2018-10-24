module.exports = async function (context, req) {
    //git test comment
    var productId = req.query.productId;
    context.res = {
        body: "The product name for your product id " + productId  + " is Starfruit Explosion and the description is This starfruit ice cream is out of this world!"
    };

};