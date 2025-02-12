// server/models/adminModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});

// পাসওয়ার্ড হ্যাশিং করার জন্য pre-save middleware
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

// পাসওয়ার্ড ভেরিফাই করার মেথড
adminSchema.methods.comparePassword = async function(candidatePassword) {
    // ADDED LOGGING HERE - INSIDE comparePassword
    console.log("\n--- bcrypt.compare() INVOCATION ---");
    console.log("candidatePassword (from login form, passed to comparePassword):", candidatePassword);
    console.log("this.password (hashed password from DB, inside comparePassword):", this.password);

    const comparisonResult = await bcrypt.compare(candidatePassword, this.password); // Re-enabled bcrypt.compare()

    console.log("bcrypt.compare() result INSIDE comparePassword:", comparisonResult); // Log result inside function
    console.log("--- bcrypt.compare() INVOCATION END ---\n");
    return comparisonResult;
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;