import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

import app from "./app";

const PORT = process.env.PORT;
import connectDB from './config/db';

(async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.info(`🚀 Server running on port ${PORT}`);
    });
})();
