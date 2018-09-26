export default (obj, { name }, { Account }) => Account.insertOne({ name }).then(({ insertedId: _id }) => ({ _id, name }))
