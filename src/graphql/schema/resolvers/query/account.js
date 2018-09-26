export default (obj, { name }, { Account }) => Account.findOne({ name })
