import 'dotenv/config'
import express from "express"
import cors from "cors"

//let datapath = path.join()
const app = express();
const port = 3000;
let store = [];

app.use(express.json());
app.use(cors());

app.post("/words", (req, res) => {
    const { message, timestamp } = req.body;

    if (!message || !timestamp) {
        return res.status(400).json({ error: "Invalid data received" });
    }
    
    store.push({message, timestamp});
    // Respond to the client
    console.log("Received data from cron job:", { message, timestamp });
    res.status(200).json({ message: "Data received successfully!" });
});

app.get("/words", (req, res) => {
    if(!store){
        return res.status(404).json({error: "data not available ..."});
    }
    res.status(200).json(store);
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})