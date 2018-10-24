const request = require('request-promise');
const uuidv1 = require('uuid/v1');
const dateFormat = require('dateformat');
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = {
    endpoint : "https://icecreamecosmos.documents.azure.com:443/",
    primaryKey : "lUIkm1fEf35GIkQqWryU0tw9XCUybbTKHlsWuE9Ld3mOXbuEtD6AWwjuGs7XGpxL3ZRn15rzYE4qDEh9ah66HQ==",
    database : { "id" : "ToDoList"},
    container : { "id" : "Rate"}
};
const client = new CosmosClient({ endpoint: config.endpoint, auth: { masterKey: config.primaryKey } });

module.exports = async function (context, req) {

    var item = {
        id : uuidv1(),
        userId : req.body.userId,
        productId : req.body.productId,
        locationName : req.body.locationName,
        timestamp : dateFormat(new Date(), "isoDateTime"),
        rating : req.body.rating,
        userNotes : req.body.userNodes
    }
    let getUserOptions = {
        uri: 'https://serverlessohuser.trafficmanager.net/api/GetUser',
        qs: { userId : item.userId }
    };
    let getProductOptions = {
        uri: 'https://serverlessohlondonproduct.azurewebsites.net/api/GetProduct',
        qs: { productId : item.productId }
    };

    await request(getUserOptions)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            context.res = {
                status: 404,
                body: error
            };
        });

    await request(getProductOptions)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            context.res = {
                status: 404,
                body: error
            };
        });

    await client.database(config.database.id).container(config.container.id).items.create(item)
        .then(function(response) {
           console.log(response);
        })
        .catch(function(error) {
            context.res = {
                status: 400,
                body: error
        };
    });

    context.res = {
        status: 200,
        body: "Raring Created"
    };

}
