import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next();
});

let vehicles = [
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
    vehicleName: 'Tata Nexon',
    vehicleNumber: 'MH12DE4567',
    type: 'Compact SUV',
    price: 1100000
  }
];

app.get('/vehicles', (req, res) => {
  res.status(200).json(vehicles);
});

app.get('/vehicles/:id', (req, res) => {
  const vehicleId = parseInt(req.params.id, 10);
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return res.status(404).json({ error: `Vehicle with ID ${vehicleId} not found` });
  }

  res.status(200).json(vehicle);
});

app.post('/vehicles', (req, res) => {
  const { id, vehicleName, vehicleNumber, type, price } = req.body;

  if (
    id === undefined ||
    !vehicleName ||
    !vehicleNumber ||
    !type ||
    price === undefined
  ) {
    return res.status(400).json({
      error: 'Missing required fields: id, vehicleName, vehicleNumber, type, and price are required'
    });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      error: 'Invalid price: price must be a positive number'
    });
  }

  const existingVehicle = vehicles.find((v) => v.id === id);
  if (existingVehicle) {
    return res.status(400).json({
      error: `Vehicle with ID ${id} already exists`
    });
  }

  const newVehicle = {
    id,
    vehicleName,
    vehicleNumber,
    type,
    price
  };

  vehicles.push(newVehicle);

  res.status(201).json({
    message: 'Vehicle added successfully',
    vehicle: newVehicle
  });
});

app.put('/vehicles/:id', (req, res) => {
  const vehicleId = parseInt(req.params.id, 10);
  const vehicleIndex = vehicles.findIndex((v) => v.id === vehicleId);

  if (vehicleIndex === -1) {
    return res.status(404).json({ error: `Vehicle with ID ${vehicleId} not found` });
  }

  const { vehicleName, vehicleNumber, type, price } = req.body;

  if (!vehicleName || !vehicleNumber || !type || price === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: vehicleName, vehicleNumber, type, and price are required'
    });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      error: 'Invalid price: price must be a positive number'
    });
  }

  vehicles[vehicleIndex] = {
    id: vehicleId,
    vehicleName,
    vehicleNumber,
    type,
    price
  };

  res.status(200).json({
    message: 'Vehicle updated successfully',
    vehicle: vehicles[vehicleIndex]
  });
});

app.delete('/vehicles/:id', (req, res) => {
  const vehicleId = parseInt(req.params.id, 10);
  const vehicleIndex = vehicles.findIndex((v) => v.id === vehicleId);

  if (vehicleIndex === -1) {
    return res.status(404).json({ error: `Vehicle with ID ${vehicleId} not found` });
  }

  const deletedVehicle = vehicles.splice(vehicleIndex, 1)[0];

  res.status(200).json({
    message: 'Vehicle deleted successfully',
    vehicle: deletedVehicle
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});