const mongoose = require('mongoose')
mongoose.connect(
  'mongodb://127.0.0.1/model__User', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
)

const User = require('../../model/User')


describe('User model test', () => {

  beforeEach(async () => {
    await User.deleteMany({})
  })

  afterAll(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  it('has a module', () => {
    expect(User).toBeDefined()
  })

  it('create user', async () => {
    const user = new User({ email: 'created@test.com', password: 'createdtest' })
    const created = await user.save()
    expect(created.email).toBe('created@test.com')

  })

  it('fetch user', async () => {
    const user = new User({ email: 'fetched@test.com', password: 'fetchedtest' })
    await user.save()
    const fetched = await User.findOne({ email: 'fetched@test.com' })
    expect(fetched.email).toBe('fetched@test.com')
  })

  it('update user', async () => {
    const user = new User({ email: 'updated@test.com', password: 'updatedtest' })
    await user.save()
    user.email = 'test@updated.com'
    const updated = await user.save()
    expect(updated.email).toBe('test@updated.com')
  })
})