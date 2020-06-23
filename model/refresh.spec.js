const mongoose = require('mongoose')
const Refresh = require('./refresh')

mongoose.connect(
  'mongodb://127.0.0.1/model__refresh', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
)


mongoose.connection.once('open', () => {
  console.log('*** MongoDB got connected ***')
  console.log(`Database : ${mongoose.connection.db.databaseName}`)
  mongoose.connection.db.dropDatabase(
    console.log(`${mongoose.connection.db.databaseName} database has been dropped.`)
  )
})

describe('Refresh model test', () => {

  beforeEach(async () => {
    await Refresh.deleteMany({})
  })

  afterAll(async () => {
    await Refresh.deleteMany({})
    await mongoose.connection.close()
  })

  it('has a module', () => {
    expect(Refresh).toBeDefined()
  })

  it('create', async () => {
    const refresh = new Refresh({ uid: 'test', token: 'created refresh token' })
    const created = await refresh.save()
    expect(created.token).toBe('created refresh token')
  })

  it('update', async () => {
    const refresh = new Refresh({ uid: 'test', token: 'created refresh token' })
    await refresh.save()
    const created = await Refresh.findOne({ token: 'created refresh token'})
    created.token = 'updated refresh token'
    const updated = await created.save()
    expect(updated.token).toBe('updated refresh token')
  })
})
