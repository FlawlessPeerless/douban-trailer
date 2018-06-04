import UserModel from '../database/schema/user'
export async function checkPassword(email :string, password :string) {
    let match = false
    const user = await UserModel.findOne({ email })

    if (user) {
        match = await user.comparePassword(password, user.password)
    }
    return {
        match,
        user
    }
}