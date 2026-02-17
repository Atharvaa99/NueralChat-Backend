require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started at PORT ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

