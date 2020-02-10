import mongoose from 'mongoose';

export async function dbConnect() {
    const uri = 'mongodb+srv://domenicosf:TtbR4pBFaEowR6XL@cluster0-baygv.mongodb.net/justmeatdb?retryWrites=true&w=majority';
    await mongoose.connect(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
}