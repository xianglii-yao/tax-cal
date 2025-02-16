import mongoose from "mongoose";
import {} from "dotenv/config"

mongoose.connect(process.env.DB_URL!);

const schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    taxes: [
        {
            income: Number,
            tax: Number,
            cess: Number,
            totalTax: Number,
        }
    ]
})

const taxInfo = mongoose.models.tax || mongoose.model('tax', schema);

export { taxInfo };