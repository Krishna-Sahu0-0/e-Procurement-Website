# 🏢 E-Procurement Portal

A modern, full-stack web application for digital procurement management, enabling transparent bidding processes between vendors and administrators.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Vendors
- 📝 **Vendor Registration & Login** - Secure authentication system
- 👤 **Profile Management** - Upload profile photos and update information
- 📋 **Browse Tenders** - View all open tenders with detailed information
- 💼 **Submit Bids** - Place competitive bids with proposals
- 📊 **Track Bids** - Monitor bid status (Submitted, Under Review, Accepted, Rejected)
- 🔔 **Status Updates** - Real-time updates on account approval status

### For Administrators
- 🔐 **Admin Authentication** - Secure admin login system
- ✅ **Vendor Approval** - Approve or reject vendor registrations
- 🔄 **Re-approval System** - Re-approve previously rejected vendors
- 📄 **Create Tenders** - Post new procurement opportunities
- 📈 **Manage Tenders** - Track tender status (Open, Closed, Awarded)
- 🎯 **Evaluate Bids** - Review and compare vendor proposals
- 🏆 **Award Contracts** - Accept winning bids and award tenders
- 📊 **Dashboard Analytics** - View statistics and pending approvals

### General Features
- 📱 **Fully Responsive** - Mobile-first design with hamburger menu
- 🎨 **Modern UI/UX** - Built with TailwindCSS and Framer Motion animations
- 🔒 **Secure Authentication** - JWT-based authentication system
- 🌐 **RESTful API** - Clean and well-structured backend
- ⚡ **Fast Performance** - Optimized for speed and efficiency
- 🎯 **User-Friendly** - Intuitive interface with smooth transitions

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - JavaScript library for building user interfaces
- **React Router DOM** 6.30.1 - Client-side routing
- **TailwindCSS** 3.4.18 - Utility-first CSS framework
- **Framer Motion** 12.23.22 - Animation library
- **Axios** 1.12.2 - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express** 5.1.0 - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.18.2 - MongoDB object modeling
- **bcryptjs** 3.0.2 - Password hashing
- **jsonwebtoken** 9.0.2 - JWT authentication
- **CORS** 2.8.5 - Cross-Origin Resource Sharing

### Development Tools
- **Nodemon** - Auto-restart server during development
- **PostCSS & Autoprefixer** - CSS processing
- **React Scripts** - Build tooling

## 📁 Project Structure

```
E-Procurement-Portal/
├── Client/                          # Frontend React Application
│   ├── public/
│   │   ├── index.html              # HTML template
│   │   └── manifest.json           # PWA manifest
│   ├── src/
│   │   ├── pages/                  # React page components
│   │   │   ├── HomePage.js         # Landing page with animations
│   │   │   ├── registerpage.js     # Vendor registration
│   │   │   ├── VendorLoginPage.js  # Vendor login
│   │   │   ├── VendorDashboard.js  # Vendor dashboard with profile dropdown
│   │   │   ├── AdminLoginPage.js   # Admin login
│   │   │   ├── AdminDashboard.js   # Admin dashboard
│   │   │   ├── CreateTender.js     # Create new tender
│   │   │   ├── TenderList.js       # Browse tenders
│   │   │   ├── TenderDetails.js    # Tender details & bid submission
│   │   │   ├── TenderBids.js       # Admin bid evaluation
│   │   │   ├── MyBids.js           # Vendor's bid history
│   │   │   ├── dashboard.css       # Dashboard styles
│   │   │   └── register.css        # Form styles
│   │   ├── app.js                  # Main App component with routes
│   │   ├── index.js                # React entry point
│   │   └── style.css               # Global styles with Tailwind
│   ├── tailwind.config.js          # Tailwind configuration
│   ├── postcss.config.js           # PostCSS configuration
│   └── package.json                # Frontend dependencies
│
├── Server/                          # Backend Node.js Application
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js      # Admin logic
│   │   ├── vendorController.js     # Vendor logic
│   │   ├── tenderController.js     # Tender CRUD operations
│   │   └── bidController.js        # Bid management
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT authentication
│   ├── models/
│   │   ├── Admin.js                # Admin schema
│   │   ├── Vendor.js               # Vendor schema
│   │   ├── Tender.js               # Tender schema
│   │   └── bid.js                  # Bid schema
│   ├── routes/
│   │   ├── adminRoutes.js          # Admin endpoints
│   │   ├── vendorRoutes.js         # Vendor endpoints
│   │   ├── tenderRoutes.js         # Tender endpoints
│   │   └── bidRoutes.js            # Bid endpoints
│   ├── createAdmin.js              # Script to create admin user
│   ├── server.js                   # Express server entry point
│   ├── .env.example                # Environment variables template
│   └── package.json                # Backend dependencies
│
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation

```

## 🚀 Installation

### Prerequisites
- Node.js (v18.x or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Clone the Repository
```bash
git clone https://github.com/yourusername/e-procurement-portal.git
cd e-procurement-portal
```

### Install Dependencies

#### Backend Setup
```bash
cd Server
npm install
```

#### Frontend Setup
```bash
cd Client
npm install
```

## ⚙️ Configuration

### 1. Setup Environment Variables

Navigate to the `Server` directory and create a `.env` file:

```bash
cd Server
cp .env.example .env
```

Edit the `.env` file with your actual credentials:

```env
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/eprocurement
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_generate_a_strong_one
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Create Admin User

Run the admin creation script:

```bash
cd Server
node createAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@eprocurement.com`
- Password: `admin123`

⚠️ **Important:** Change the password after first login!

## 🏃 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd Server
npm start
```
Server will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd Client
npm start
```
Client will run on `http://localhost:3000`

### Production Mode

#### Build Frontend
```bash
cd Client
npm run build
```

#### Deploy Backend
- Configure your hosting service (Heroku, AWS, DigitalOcean, etc.)
- Set environment variables on your hosting platform
- Deploy the `Server` directory

## 📡 API Documentation

### Authentication Endpoints

#### Vendor Authentication
- `POST /api/vendors/register` - Register new vendor
- `POST /api/vendors/login` - Vendor login

#### Admin Authentication
- `POST /api/admin/login` - Admin login

### Vendor Management
- `GET /api/admin/vendors` - Get all vendors (Admin)
- `PUT /api/admin/vendors/:id` - Update vendor status (Admin)

### Tender Management
- `GET /api/tenders` - Get all tenders (Public)
- `GET /api/tenders/:id` - Get tender by ID
- `POST /api/tenders` - Create tender (Admin)
- `PUT /api/tenders/:id` - Update tender (Admin)
- `DELETE /api/tenders/:id` - Delete tender (Admin)
- `GET /api/tenders/:id/bids` - Get bids for tender (Admin)

### Bid Management
- `POST /api/bids` - Submit bid (Vendor)
- `GET /api/bids/my-bids` - Get vendor's bids
- `PUT /api/bids/:id` - Update bid status (Admin)

### Request Headers
All protected routes require JWT token:
```
Authorization: Bearer <token>
```

## 📱 Mobile Responsiveness

The application is fully responsive with:
- 🍔 Hamburger menu for mobile navigation
- 📏 Adaptive layouts for all screen sizes
- 👆 Touch-optimized buttons (48px minimum)
- 📱 iOS-friendly forms (no auto-zoom)
- 🎨 Smooth animations on all devices

**Tested Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🔐 Security Features

- 🔒 Password hashing with bcrypt
- 🎫 JWT-based authentication
- 🛡️ Protected API routes
- 🚫 CORS configuration
- 🔑 Environment variable protection
- ✅ Input validation
- 🔐 Secure admin approval system

## 🎨 UI Features

- 🌈 Modern gradient backgrounds
- ✨ Framer Motion animations
- 🎯 TailwindCSS utility classes
- 📦 Card-based layouts
- 🔵 Color-coded action buttons
- 💫 Smooth transitions
- 🖼️ Profile photo upload
- 📊 Dashboard statistics

## 🐛 Known Issues & Future Enhancements

### Planned Features
- [ ] Email notifications for bid updates
- [ ] Document upload for tenders
- [ ] Advanced search and filters
- [ ] Real-time notifications with WebSockets
- [ ] Payment integration
- [ ] Tender templates
- [ ] Vendor ratings and reviews
- [ ] Multi-language support
- [ ] Export reports to PDF

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Krishna-Sahu0-0](https://github.com/Krishna-Sahu0-0)
- LinkedIn: [Your Profile](https://linkedin.com/in/krishna-sahu00)

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS
- Framer Motion for smooth animations
- MongoDB team for the database
- Express.js community

## 📧 Contact

For questions or support, please email: krsnasahu939@gmail.com

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ and ☕**
