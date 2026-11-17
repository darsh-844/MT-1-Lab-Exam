import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vehicles = [
  {
    id: 1,
    vehicleName: 'Hyundai Creta',
    vehicleNumber: 'HR26AB1234',
    type: 'SUV',
    price: 1500000
  },
  {
    id: 2,
    vehicleName: 'Honda City',
    vehicleNumber: 'DL3CAX9876',
    type: 'Sedan',
    price: 1250000
  },
  {
    id: 3,
    vehicleName: 'BMW M5',
    vehicleNumber: 'DL3CAX9876',
    type: 'Sedan',
    price: 1250000
  }
];

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Vehicle Management</title></head>
        <body style="font-family: Arial, sans-serif; margin: 40px;">
          <h1>Welcome to the Vehicle Management Web Application</h1>
          <p>Running on native Node.js HTTP Server (Port ${PORT}).</p>
          <p>Explore: <a href="/vehicles">/vehicles</a> | <a href="/about">/about</a> | <a href="/info">/info</a></p>
        </body>
      </html>
    `);
  }

  else if (url === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>About - Vehicle Management</title></head>
        <body style="font-family: Arial, sans-serif; margin: 40px;">
          <h2>About Vehicle Management Application</h2>
          <p>This application demonstrates Node.js built-in HTTP routing, FS static file serving, and JSON data handling without an external database.</p>
        </body>
      </html>
    `);
  }

  else if (url === '/info' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'info.html');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error: Unable to load info.html' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }

  else if (url === '/vehicles' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(vehicles));
  }

  else if (url === '/add-vehicle' && method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        if (!body) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Request body cannot be empty' }));
          return;
        }

        const newVehicle = JSON.parse(body);
        const { id, vehicleName, vehicleNumber, type, price } = newVehicle;

        if (
          id === undefined ||
          !vehicleName ||
          !vehicleNumber ||
          !type ||
          price === undefined
        ) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              error: 'Missing required fields: id, vehicleName, vehicleNumber, type, and price are required.'
            })
          );
          return;
        }

        if (typeof price !== 'number' || price <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Price must be a positive number.' }));
          return;
        }

        const vehicleRecord = { id, vehicleName, vehicleNumber, type, price };
        vehicles.push(vehicleRecord);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            message: 'Vehicle added successfully',
            vehicle: vehicleRecord
          })
        );
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON format in request body' }));
      }
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});