const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Car = require('./models/Car');
const connectDB = require('./config/db');

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
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
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
      'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
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
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Bangalore',
    status: 'sold'
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
    kilometers: 32000,
    color: 'Platinum White Pearl',
    registrationState: 'DL-01 (Delhi)',
    insurance: 'Comprehensive',
    description: 'Executive sedan in immaculate condition. 10th generation Honda Civic ZX top trim. Includes lane watch camera, electric sunroof, dual-zone climate control, and digital cockpit display. Driven strictly within city limits, bumper-to-bumper genuine condition.',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Delhi',
    status: 'available'
  },
  {
    title: 'Hyundai Creta SX Plus',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX Plus 1.5 Diesel AT',
    year: 2021,
    price: 1520000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 41000,
    color: 'Phantom Black',
    registrationState: 'KA-03 (Indiranagar)',
    insurance: 'Comprehensive',
    description: 'Popular compact SUV with outstanding mileage. Features a panoramic sunroof, ventilated front seats, Bose 8-speaker audio, and blue ambient lighting. Comprehensive insurance valid till Dec 2026. Non-accidental, non-flooded, verified service records.',
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Bangalore',
    status: 'available'
  },
  {
    title: 'Toyota Fortuner 2.8L 4x4 Sigma 4',
    brand: 'Toyota',
    model: 'Fortuner',
    variant: '2.8L 4x4 Sigma 4 Diesel AT',
    year: 2022,
    price: 3950000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 26000,
    color: 'Super White',
    registrationState: 'MH-04 (Thane)',
    insurance: 'Comprehensive',
    description: 'Indestructible Toyota Fortuner with 4x4 drivetrain and differential lock. 500 Nm torque diesel powertrain. Comes with genuine Toyota accessories including bull bar, side steps, and ceramic tint. Under official factory warranty till 2027.',
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
    variant: '110 HSE 2.0L Turbo',
    year: 2022,
    price: 9800000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 19000,
    color: 'Pangea Green',
    registrationState: 'DL-02 (New Delhi)',
    insurance: 'Comprehensive',
    description: 'Rugged luxury off-roader with air suspension, Terrain Response 2, Meridian audio system, panoramic roof, and 20-inch gloss black alloy wheels with all-terrain tires. Head-turner spec in rare Pangea Green with contrasting white roof.',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Delhi',
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
    description: 'Immaculate Porsche 911 Carrera S with 450 HP. Under complete Porsche warranty and service package. Equipped with Sport Chrono package, active suspension management, sports exhaust system, and 20/21-inch Carrera Classic wheels. PPF installed.',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Delhi',
    status: 'sold'
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
    kilometers: 21000,
    color: 'Intensi-Teal',
    registrationState: 'MH-14 (Pimpri)',
    insurance: 'Comprehensive',
    description: 'Highest selling electric SUV in India. 437 km ARAI range on a single charge. Features electronic parking brake, ventilated front seats, wireless smartphone charger, and Harman 8-speaker sound system. Fast DC charger and home 7.2kW wall box included.',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    city: 'Mumbai',
    status: 'sold'
  },
  {
    title: 'Kia Seltos GTX Plus DCT',
    brand: 'Kia',
    model: 'Seltos',
    variant: 'GTX Plus 1.4 Turbo DCT',
    year: 2020,
    price: 1380000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 37000,
    color: 'Glacier White Pearl',
    registrationState: 'KA-04 (Yeshwanthpur)',
    insurance: 'Comprehensive',
    description: 'Sporty compact SUV with 1.4L Turbo engine producing 140 HP. Features heads-up display, 360-degree parking camera, Bose sound system, ventilated front seats, and UVO connected car capabilities. Well maintained with genuine periodic services.',
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
    year: 2021,
    price: 4350000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 16500,
    color: 'Cavansite Blue',
    registrationState: 'MH-01 (South Mumbai)',
    insurance: 'Comprehensive',
    description: 'Pristine Mercedes-Benz C200 with 64-color ambient lighting, panoramic sliding sunroof, digital instrument cluster, memory seating, and wireless phone charging. Single doctor-owned vehicle, always driven with chauffeur, spotless interior.',
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
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
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
    status: 'sold'
  },
  {
    title: 'Toyota Camry Hybrid 2.5L',
    brand: 'Toyota',
    model: 'Camry',
    variant: 'Hybrid 2.5L AT',
    year: 2020,
    price: 3600000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 31000,
    color: 'Burning Black',
    registrationState: 'MH-03 (Kurla)',
    insurance: 'Comprehensive',
    description: 'Executive luxury hybrid sedan delivering supreme ride comfort and stellar 23+ km/l fuel efficiency. Includes reclining rear seats with rear armrest touch controls, ventilated seats, HUD, and 9-speaker JBL audio system.',
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
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
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
    year: 2022,
    price: 990000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: 'First',
    kilometers: 15000,
    color: 'Fiery Red',
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

const seedDatabase = async (exitOnFinish = true) => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Database connected successfully.');

    // 1. Clear existing cars
    console.log('Clearing existing cars...');
    await Car.deleteMany({});

    // 2. Clear & create Demo Seller Account (AutoHub Premier Dealer)
    await User.deleteMany({ email: 'dealer@autohub.com' });
    console.log('Creating demo dealer account...');
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

    // 3. Clear & create User Account for Rance D'monte
    await User.deleteMany({ email: 'rance@autohub.com' });
    console.log('Creating user account for Rance D\'monte...');
    const ranceUser = new User({
      name: 'Rance D\'monte',
      email: 'rance@autohub.com',
      password: 'password123',
      phone: '+91 98765 11223',
      city: 'Mumbai',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
    });
    await ranceUser.save();
    console.log(`Rance user created with ID: ${ranceUser._id}`);

    // 4. Seed listings for the Dealer (14 available, 4 sold)
    console.log('Inserting dealer car listings...');
    const carsToInsert = carsData.map(car => ({
      ...car,
      sellerId: seller._id
    }));
    await Car.insertMany(carsToInsert);

    // 5. Seed listings for Rance D'monte & any other registered users
    const personalCars = [
      {
        title: 'BMW M4 Competition Coupe',
        brand: 'BMW',
        model: 'M4',
        variant: 'Competition 3.0L Twin-Turbo',
        year: 2023,
        price: 9200000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        owner: 'First',
        kilometers: 8500,
        color: 'Isle of Man Green',
        registrationState: 'MH-01 (Mumbai South)',
        insurance: 'Comprehensive',
        description: 'Pristine 2023 BMW M4 Competition Coupe with carbon exterior package, M carbon bucket seats, laser headlights, and head-up display.',
        images: [
          'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
        ],
        city: 'Mumbai',
        status: 'available',
        sellerId: ranceUser._id
      },
      {
        title: 'Mercedes-AMG G63 V8 Biturbo',
        brand: 'Mercedes-Benz',
        model: 'G-Class',
        variant: 'AMG G63 4.0L V8',
        year: 2022,
        price: 24500000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        owner: 'First',
        kilometers: 14000,
        color: 'Obsidian Black Metallic',
        registrationState: 'DL-01 (Delhi)',
        insurance: 'Comprehensive',
        description: 'Iconic Mercedes-AMG G63 featuring Night Package, 22-inch forged cross-spoke wheels, and Burmester sound system.',
        images: [
          'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80'
        ],
        city: 'Delhi',
        status: 'available',
        sellerId: ranceUser._id
      },
      {
        title: 'Audi RS5 Sportback Quattro',
        brand: 'Audi',
        model: 'RS5',
        variant: '2.9L Twin-Turbo V6',
        year: 2021,
        price: 8800000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        owner: 'First',
        kilometers: 18000,
        color: 'Nardo Grey',
        registrationState: 'MH-02 (Mumbai)',
        insurance: 'Comprehensive',
        description: 'Stunning Nardo Grey RS5 Sportback with RS dynamic package, Bang & Olufsen 3D sound, and panoramic sunroof.',
        images: [
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80'
        ],
        city: 'Mumbai',
        status: 'available',
        sellerId: ranceUser._id
      },
      {
        title: 'Porsche Taycan 4S Electric',
        brand: 'Porsche',
        model: 'Taycan',
        variant: '4S Performance Battery Plus',
        year: 2021,
        price: 13500000,
        fuelType: 'Electric',
        transmission: 'Automatic',
        owner: 'First',
        kilometers: 16000,
        color: 'Frozen Blue Metallic',
        registrationState: 'MH-02 (Mumbai)',
        insurance: 'Comprehensive',
        description: 'High-performance all-electric Porsche Taycan 4S. 530 HP launch control, adaptive air suspension, passenger display, and sport chrono package.',
        images: [
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
        ],
        city: 'Mumbai',
        status: 'sold',
        sellerId: ranceUser._id
      },
      {
        title: 'Jeep Wrangler Rubicon 4x4',
        brand: 'Jeep',
        model: 'Wrangler',
        variant: 'Rubicon 2.0L Turbo',
        year: 2021,
        price: 5800000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        owner: 'First',
        kilometers: 22000,
        color: 'Firecracker Red',
        registrationState: 'MH-01 (Mumbai)',
        insurance: 'Comprehensive',
        description: 'Ultimate off-roader with Rock-Trac 4x4, Tru-Lok front and rear locking differentials, and removable hardtop roof.',
        images: [
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
        ],
        city: 'Mumbai',
        status: 'sold',
        sellerId: ranceUser._id
      }
    ];

    await Car.insertMany(personalCars);

    // Also populate any other existing users in DB if they have 0 cars
    const otherUsers = await User.find({ _id: { $nin: [seller._id, ranceUser._id] } });
    for (const u of otherUsers) {
      const userCars = personalCars.map(c => ({
        ...c,
        _id: new mongoose.Types.ObjectId(),
        sellerId: u._id
      }));
      await Car.insertMany(userCars);
      console.log(`Seeded ${userCars.length} sample listings for user: ${u.name} (${u.email})`);
    }

    console.log('\n--- Seeding Completed Successfully ---');
    console.log('Demo Login Accounts:');
    console.log('1. AutoHub Premier Dealer: dealer@autohub.com / password123 (18 listings: 14 available, 4 sold)');
    console.log('2. Rance D\'monte:          rance@autohub.com  / password123 (5 listings: 3 available, 2 sold)');
    console.log('------------------------------------');

    if (exitOnFinish) {
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (exitOnFinish) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = { seedDatabase, carsData };
