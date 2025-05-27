const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const freelancerRoutes = require("./routes/freelancerRoutes");
const businessRoutes = require("./routes/businessRoutes");
const marketRoutes = require("./routes/marketRoutes");
const individualRoutes = require("./routes/individualRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: '*',
}));

app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/admin/api", adminRoutes);
app.use("/auth/api", authRoutes);
app.use("/company/api", companyRoutes);
app.use("/freelancer/api", freelancerRoutes);
app.use("/business/api", businessRoutes);
app.use("/market/api", marketRoutes);
app.use("/individual/api", individualRoutes);

const PORT = process.env.PORT || 5006;
const DEFAULT_PORT = 5006;


app.get('/', function (req, res) {
    res.send('Hello CivilHubs')
  })

const server = app.listen(PORT, () => {
    // console.log(`Server running on port http://localhost:${PORT}`);
    console.log(`Server running on port http://192.168.1.6:${PORT}`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log(`Port ${DEFAULT_PORT} is in use. Trying another port...`);
        app.listen(DEFAULT_PORT + 1, () => console.log(`Server started on port ${DEFAULT_PORT + 1}`));
    } else {
        console.error("Server error:", err);
    }
});
