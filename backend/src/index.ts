import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { taxInfo } from './mongoose.config';
import cors from "cors";

const calculateTax = (income: number): { tax: number; cess: number; totalTax: number } => {
    let tax = 0;
    if (income <= 250000) {
        tax = 0;
    } else if (income <= 500000) {
        tax = (income - 250000) * 0.05;
    } else if (income <= 750000) {
        tax = 12500 + (income - 500000) * 0.10;
    } else if (income <= 1000000) {
        tax = 37500 + (income - 750000) * 0.15;
    } else if (income <= 1250000) {
        tax = 75000 + (income - 1000000) * 0.20;
    } else if (income <= 1500000) {
        tax = 125000 + (income - 1250000) * 0.25;
    } else {
        tax = 187500 + (income - 1500000) * 0.30;
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;

    return {
        tax: parseFloat(tax.toFixed(2)),
        cess: parseFloat(cess.toFixed(2)),
        totalTax: parseFloat(totalTax.toFixed(2)),
    };
};

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/', async (req, res, next) => {
    const { name, income } = req.body;
    if (typeof income !== 'number' || income < 0) {
        const errorResponse: { error: string } = { error: "Invalid income value. Income must be a positive number." };
        return res.status(400).json(errorResponse);
    }

    const { tax, cess, totalTax } = calculateTax(income);
    const existinguser = await taxInfo.findOne({ name });
    if (!existinguser) {
        const taxinfo = new taxInfo({
            name,
            taxes: [{
                income,
                tax,
                cess,
                totalTax
            }]
        })
        taxinfo.save();
    } else {
        let prev = existinguser.taxes as any[]
        prev = [...prev, {
            income,
            tax,
            cess,
            totalTax,
        }]
        await taxInfo.findByIdAndUpdate(existinguser._id, { taxes:prev }, { new: true });
    }


    const response = {
        income,
        tax,
        cess,
        totalTax,
    };
    res.json(response);
})
app.post('/history', async ( req: Request, res : Response) => {
    const { name } = req.body;
    const user = await taxInfo.findOne({ name });
    res.json(user.taxes)
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const errorResponse: { error: string } = { error: 'Something went wrong!' };
    res.status(500).json(errorResponse);
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})