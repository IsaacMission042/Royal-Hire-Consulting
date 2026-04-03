const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-hire')
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            await mongoose.connection.collection('modules').dropIndex('moduleNumber_1');
            console.log('Index moduleNumber_1 dropped successfully');
        } catch (err) {
            if (err.codeName === 'IndexNotFound') {
                console.log('Index moduleNumber_1 not found, nothing to do.');
            } else {
                console.error('Error dropping index:', err.message);
            }
        }
        process.exit();
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
