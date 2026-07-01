const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Car = require('./models/Car');

// Load environment variables
dotenv.config();

const carsData = [
  {
    title: 'Tesla Model 3 Performance',
    brand: 'Tesla',
    model: 'Model 3',
    variant: 'Performance AWD',
    year: 2023,
    price: 4500000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 12000,
    color: 'Midnight Silver Metallic',
    registrationState: 'MH-02 (Mumbai)',
    insurance: 'Comprehensive',
    description: 'Immaculate condition Tesla Model 3 Performance. Dual motor all-wheel drive, 0-100 km/h in 3.3 seconds. Fully loaded with premium white interior, Autopilot enabled, 20-inch Uberturbine wheels, and carbon fiber spoiler. Single owner, always garage kept, and only supercharged a handful of times. Battery and drive unit warranty active until 2031.',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Mumbai',
    status: 'available'
  },
  {
    title: 'BMW 3 Series 330i M Sport',
    brand: 'BMW',
    model: '3 Series',
    variant: '330i M Sport',
    year: 2021,
    price: 3850000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 28500,
    color: 'Portimao Blue',
    registrationState: 'DL-03 (Delhi)',
    insurance: 'Comprehensive',
    description: 'Looking to sell my BMW 330i M Sport. Complete service history at BMW authorized service centers. Features an active M Sport suspension, variable sport steering, sunroof, Live Cockpit Professional, and ambient lighting. No accidents, minor scratches on the rear bumper. Tires recently replaced with Michelin Pilot Sport 4S.',
    images: [
      'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Delhi',
    status: 'available'
  },
  {
    title: 'Audi A4 40 TFSI Technology',
    brand: 'Audi',
    model: 'A4',
    variant: '40 TFSI Technology',
    year: 2022,
    price: 3400000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 18000,
    color: 'Ibis White',
    registrationState: 'KA-51 (Bangalore)',
    insurance: 'Comprehensive',
    description: 'Top-of-the-line Audi A4 Technology edition. Features Audi Virtual Cockpit, 3-zone climate control, panoramic glass sunroof, matrix LED headlights, and Bang & Olufsen 3D Premium Sound System. Excellent fuel economy with the mild-hybrid system. Looking for a quick sale as I am relocating abroad.',
    images: [
      'https://images.unsplash.com/photo-1606577924046-27869c8d7f4c?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Bangalore',
    status: 'available'
  },
  {
    title: 'Ford Mustang GT V8 Fastback',
    brand: 'Ford',
    model: 'Mustang',
    variant: 'GT V8 Fastback',
    year: 2018,
    price: 5200000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'Second',
    kilometers: 35000,
    color: 'Race Red',
    registrationState: 'MH-12 (Pune)',
    insurance: 'Third-party',
    description: 'Naturally aspirated 5.0L V8 beast producing 415 HP. Equipped with a custom Borla exhaust system (sounds incredible), aftermarket cold air intake, and upgraded Brembo brakes. Regularly serviced, ceramic coated, and pristine leather seats inside. Serious buyers only. Test drives will be accompanied.',
    images: [
      'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Mumbai',
    status: 'available'
  },
  {
    title: 'Honda Civic ZX CVT',
    brand: 'Honda',
    model: 'Civic',
    variant: 'ZX CVT',
    year: 2020,
    price: 1650000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 42000,
    color: 'Modern Steel Metallic',
    registrationState: 'KA-03 (Bangalore)',
    insurance: 'Comprehensive',
    description: 'Perfect daily driver Honda Civic ZX (top variant). Equipped with LaneWatch camera, leather upholstery, 7-inch infotainment with Apple CarPlay/Android Auto, and full LED headlights. Unmatched comfort and handling stability. Serviced on schedule at Honda showrooms only. Highly reliable and great mileage.',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Bangalore',
    status: 'available'
  },
  {
    title: 'Hyundai Creta SX Plus',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX Plus 1.6 CRDi',
    year: 2019,
    price: 1100000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    owner: 'First',
    kilometers: 64000,
    color: 'Phantom Black',
    registrationState: 'DL-08 (Delhi)',
    insurance: 'Expired',
    description: 'Reliable Hyundai Creta Diesel SUV. Extremely punchy and fuel-efficient 1.6L engine. Comes with wireless charging, projector headlights, keyless entry/start, and steering-mounted controls. Well maintained, perfect suspension for bumpy roads, and zero engine issues. Selling because we upgraded to a 7-seater.',
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Delhi',
    status: 'available'
  },
  {
    title: 'Toyota Fortuner 2.8L 4x4 Sigma 4',
    brand: 'Toyota',
    model: 'Fortuner',
    variant: '2.8L 4x4 Automatic',
    year: 2021,
    price: 3800000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 45000,
    color: 'Super White',
    registrationState: 'MH-14 (Pune)',
    insurance: 'Comprehensive',
    description: 'Unbeatable reliability with this Toyota Fortuner 2.8L 4x4. Comes with massive road presence, active traction control, downhill assist, and a 11-speaker JBL audio system. Maintained strictly at Toyota authorized dealers with service logs. Used mostly for highway cruising.',
    images: [
      'https://images.unsplash.com/photo-1594568284297-7c64464062b1?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Mumbai',
    status: 'available'
  },
  {
    title: 'Land Rover Defender 110 HSE',
    brand: 'Land Rover',
    model: 'Defender',
    variant: '110 HSE P300',
    year: 2022,
    price: 9500000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 15000,
    color: 'Obsidian Black',
    registrationState: 'MH-01 (Colaba)',
    insurance: 'Comprehensive',
    description: 'Adventure-ready Land Rover Defender 110 HSE. Features air suspension, 3D surround camera, sliding panoramic sunroof, and Pivi Pro infotainment system. Equipped with the explorer pack (roof rack and side gear carrier). Mint condition, single driver.',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Mumbai',
    status: 'available'
  },
  {
    title: 'Porsche 911 Carrera S (992)',
    brand: 'Porsche',
    model: '911',
    variant: 'Carrera S',
    year: 2020,
    price: 14500000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'Second',
    kilometers: 8200,
    color: 'Guards Red',
    registrationState: 'DL-01 (South Delhi)',
    insurance: 'Comprehensive',
    description: 'Immaculate Porsche 911 Carrera S with 450 HP. Under complete Porsche warranty and service package. Equipped with Sport Chrono package, active suspension management, sports exhaust system, and 20/21-inch Carrera Classic wheels. PPF (Paint Protection Film) installed.',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Delhi',
    status: 'available'
  },
  {
    title: 'Tata Nexon EV Max XZ+ Lux',
    brand: 'Tata',
    model: 'Nexon EV',
    variant: 'Max XZ+ Lux (40.5kWh)',
    year: 2022,
    price: 1550000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 18500,
    color: 'Signature Blue',
    registrationState: 'MH-03 (Chembur)',
    insurance: 'Comprehensive',
    description: 'Tata Nexon EV Max with 437 km ARAI certified range. Features ventilated seats, electronic parking brake with auto-hold, wireless charger, and air purifier. Comes with the home fast charger accessory. Excellent running costs and eco-friendly performance.',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Mumbai',
    status: 'available'
  },
  {
    title: 'Kia Seltos GTX Plus DCT',
    brand: 'Kia',
    model: 'Seltos',
    variant: 'GTX Plus 1.4 T-GDi',
    year: 2021,
    price: 1680000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 32000,
    color: 'Gravity Grey',
    registrationState: 'KA-01 (Bangalore Central)',
    insurance: 'Comprehensive',
    description: 'Sporty Kia Seltos GTX Plus DCT with 1.4L turbo engine. Features a HUD (Head-Up Display), 360-degree camera, blind-spot monitoring, BOSE speaker system, and red styling accents. Zero insurance claims, single owner, and detailed showroom records.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Bangalore',
    status: 'available'
  },
  {
    title: 'Mercedes-Benz C-Class C200 Avantgarde',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    variant: 'C200 Avantgarde',
    year: 2022,
    price: 4800000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 14000,
    color: 'Iridium Silver',
    registrationState: 'MH-47 (Mumbai North)',
    insurance: 'Comprehensive',
    description: 'Elegant and sleek Mercedes-Benz C200 with mild-hybrid tech. Large central touchscreen display, active brake assist, memory seats, and panoramic sunroof. Under factory warranty. Drives like new, scratchless condition.',
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Mumbai',
    status: 'available'
  },
  {
    title: 'Jeep Compass Model S 4x4',
    brand: 'Jeep',
    model: 'Compass',
    variant: 'Model S 2.0 Diesel 4x4',
    year: 2021,
    price: 2250000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 26000,
    color: 'Bright White',
    registrationState: 'KA-04 (Yeshwanthpur)',
    insurance: 'Comprehensive',
    description: 'Fully loaded top-end Jeep Compass Model S. Features dual-pane panoramic sunroof, 10.1-inch infotainment, wireless charging, power tailgate, and 4x4 Select-Terrain system. Serviced on time at Jeep service centers, zero errors.',
    images: [
      'https://images.unsplash.com/photo-1707010419358-d93cd77c5f8c?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Bangalore',
    status: 'available'
  },
  {
    title: 'Maruti Suzuki Swift ZXi',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'ZXi 1.2L',
    year: 2019,
    price: 620000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    owner: 'First',
    kilometers: 52000,
    color: 'Solid Red',
    registrationState: 'DL-04 (West Delhi)',
    insurance: 'Comprehensive',
    description: 'Very clean Maruti Suzuki Swift ZXi. Highly reliable daily hatchback, low maintenance, and excellent fuel efficiency (18+ km/l). Equipped with alloy wheels, push-button start, automatic climate control, and rear parking sensors. No modifications.',
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Delhi',
    status: 'available'
  },
  {
    title: 'Toyota Camry Hybrid 2.5L',
    brand: 'Toyota',
    model: 'Camry',
    variant: '2.5L Hybrid',
    year: 2020,
    price: 3200000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 38000,
    color: 'Silver Metallic',
    registrationState: 'MH-04 (Thane)',
    insurance: 'Comprehensive',
    description: 'Luxury combined with ultimate fuel economy (22+ km/l) in this Toyota Camry Hybrid. Extremely quiet cabin, reclining rear seats, three-zone climate control, and premium audio. Ideal chauffeur-driven car. Meticulously maintained.',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Mumbai',
    status: 'available'
  },
  {
    title: 'Volvo XC90 B6 Inscription',
    brand: 'Volvo',
    model: 'XC90',
    variant: 'B6 Inscription Mild-Hybrid',
    year: 2021,
    price: 7200000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 29000,
    color: 'Crystal White',
    registrationState: 'KA-05 (Jayanagar)',
    insurance: 'Comprehensive',
    description: 'The safest 7-seater luxury SUV on the market. Volvo XC90 Inscription with Nappa leather seats, Bowers & Wilkins sound system, radar-based safety features, and massage seats. Immaculate condition inside and out.',
    images: [
      'https://images.unsplash.com/photo-1623998021451-31d864197e41?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Bangalore',
    status: 'available'
  },
  {
    title: 'Jaguar XF Portfolio Diesel',
    brand: 'Jaguar',
    model: 'XF',
    variant: 'Portfolio 2.0L',
    year: 2019,
    price: 4100000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    owner: 'Second',
    kilometers: 41000,
    color: 'Italian Racing Red',
    registrationState: 'MH-02 (Mumbai)',
    insurance: 'Comprehensive',
    description: 'Sporty and powerful Jaguar XF Portfolio. Features Meridian surround sound system, interactive driver display, red brake calipers, and beautiful tan leather seats. Head-turner on the road, drives beautifully.',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Mumbai',
    status: 'available'
  },
  {
    title: 'Hyundai i20 Asta (O) Turbo DCT',
    brand: 'Hyundai',
    model: 'i20',
    variant: 'Asta (O) 1.0 Turbo DCT',
    year: 2021,
    price: 780000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 21000,
    color: 'Polar White',
    registrationState: 'DL-09 (Rohini)',
    insurance: 'Comprehensive',
    description: 'Fun-to-drive premium hatchback with a 1.0L turbo-petrol engine and dual-clutch transmission. Features digital instrument cluster, sunroof, 10.25-inch touchscreen, Bose sound system, and blue ambient lighting. Under extended warranty.',
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Delhi',
    status: 'available'
  }
];

const seedDatabase = async () => {
  try {
    // 1. Connect to the database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully.');

    // 2. Clear existing entries
    console.log('Clearing existing cars and seed user...');
    await Car.deleteMany({});
    await User.deleteMany({ email: 'dealer@autohub.com' });

    // 3. Create a Demo Seller Account
    console.log('Creating demo seller...');
    const seller = new User({
      name: 'AutoHub Premier Dealer',
      email: 'dealer@autohub.com',
      password: 'password123',
      phone: '+91 98765 43210',
      city: 'Mumbai',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80'
    });

    await seller.save();
    console.log(`Demo seller created with ID: ${seller._id}`);

    // 4. Inject sellerId into cars data and save
    console.log('Inserting sample car listings...');
    const carsToInsert = carsData.map(car => ({
      ...car,
      sellerId: seller._id
    }));

    await Car.insertMany(carsToInsert);
    console.log(`Successfully seeded ${carsToInsert.length} car listings!`);

    // 5. Success summary
    console.log('\n--- Seeding Completed Successfully ---');
    console.log('Demo Login Credentials for Testing:');
    console.log('Email: dealer@autohub.com');
    console.log('Password: password123');
    console.log('------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
