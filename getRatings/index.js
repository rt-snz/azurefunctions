const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = {
    endpoint : "https://icecreamecosmos.documents.azure.com:443/",
    primaryKey : "lUIkm1fEf35GIkQqWryU0tw9XCUybbTKHlsWuE9Ld3mOXbuEtD6AWwjuGs7XGpxL3ZRn15rzYE4qDEh9ah66HQ==",
    database : { "id" : "ToDoList"},
    container : { "id" : "Rate"}
};
const client = new CosmosClient({ endpoint: config.endpoint, auth: { masterKey: config.primaryKey } });

module.exports = async function (context, req) {

    const querySpec = {
        query: "select r.id, r.userId, r.productId, r.timestamp, r.locationName, r.rating, r.userNotes from Rate r where r.userId = @userId",
        parameters : [
            {
                name : "@userId",
                value : req.query.userId
            }
        ]
    };
    
    await client.database(config.database.id).container(config.container.id).items.query(querySpec).toArray()
        .then(function(response) {
            console.log(response);
            context.res = {
                status: 200,
                body: response.result
            };
        

        })
        .catch(function(error) {
            context.res = {
                status: 404,
                body: error
            };
        });


}
