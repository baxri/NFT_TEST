import { create } from "ipfs-http-client";

// connect to a different API
const ipfs = create("https://ipfs.infura.io:5001/");

export default ipfs;
