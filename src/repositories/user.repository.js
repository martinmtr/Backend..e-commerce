export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    findByEmail = async (email) => {
        return await this.dao.findOne({ email });
    }

    updateUser = async (id, data) => {
        return await this.dao.findByIdAndUpdate(id, data, { new: true });
    }
    
    findOne = async (query) => {
        return await this.dao.findOne(query);
    }

    updatePassword = async (user, newPassword) => {
    
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
        throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }

                        
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    return await user.save(); 
};
};