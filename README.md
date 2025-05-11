# Xeno CRM - Customer Relationship Management System


Xeno CRM is a comprehensive Customer Relationship Management system designed to streamline business operations, enhance customer engagement, and optimize marketing campaigns. Built with modern technologies including React, Vite, and Tailwind CSS, Xeno CRM offers a sleek, responsive interface with powerful features for managing customers, orders, and marketing campaigns.

## Features

### 🚀 Core Modules

1. **Customer Management**
   - Centralized customer database with detailed profiles
   - Track customer interactions and purchase history
   - Segment customers for targeted marketing
   - Import/Export customer data in CSV format
   - Real-time customer activity tracking

2. **Order Management**
   - Process and track customer orders
   - Order status tracking (Pending, Completed, Cancelled)
   - Order history and customer purchase patterns
   - Detailed order analytics and reporting
   - Multi-item order processing

3. **Marketing Campaigns**
   - Create and manage multi-channel campaigns
   - AI-powered content generation and optimization
   - Audience segmentation and targeting
   - Campaign performance analytics
   - Real-time delivery status tracking

### ✨ Advanced Features

- **AI-Powered Tools**
  - AI-generated message variants
  - Natural language segment builder
  - Campaign performance summaries
  - Smart recommendations

- **Real-time Analytics**
  - Interactive dashboards
  - Status distribution visualizations
  - Delivery success rate tracking
  - Customer segment performance

- **Data Management**
  - Bulk export capabilities
  - Advanced filtering and sorting
  - Paginated data tables
  - Drag-and-drop rule builder

## Technology Stack

### Frontend
- **React** - JavaScript library for building user interfaces
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React DnD** - Drag and drop functionality
- **React Icons (Lucide)** - Beautiful, consistent icons
- **Clerk** - Authentication and user management

### Backend (API)
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- Access to the Xeno CRM backend API

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/xeno-crm.git
   cd xeno-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   VITE_API_URL=your_backend_api_url
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure

```
xeno-crm/
├── src/
│   ├── components/               # React components
│   │   ├── CampaignLogsModal.jsx # Campaign logs modal
│   │   ├── Campaigns.jsx         # Campaigns management
│   │   ├── CreateCampaignModal.jsx # Campaign creation
│   │   ├── CustomerModal.jsx     # Customer management modal
│   │   ├── Customers.jsx         # Customers management
│   │   ├── Home.jsx              # Dashboard
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── NotFound.jsx          # 404 page
│   │   ├── OrderModal.jsx        # Order management modal
│   │   └── Orders.jsx            # Orders management
│   ├── context/                  # Application context
│   │   ├── AppContext.jsx        # Global state management
│   │   └── api.js                # API service layer
│   ├── App.jsx                   # Main application component
│   └── main.jsx                  # Application entry point
├── public/                       # Static assets
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies
├── README.md                     # Project documentation
└── vite.config.js                # Vite configuration
```

## Usage Guide

### Customers Module
1. Navigate to the Customers section
2. Use search and filters to find specific customers
3. Click "New Customer" to add a new customer
4. Edit existing customers by clicking the edit icon
5. Export customer data using the Export button

### Orders Module
1. Navigate to the Orders section
2. View order status and details
3. Create new orders with multiple items
4. Update order status as they progress
5. Export order history for reporting

### Campaigns Module
1. Navigate to the Campaigns section
2. Create new campaigns with the "New Campaign" button
3. Use the AI tools to generate content and segments
4. Preview audience before sending
5. View detailed delivery logs and statistics

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact:
- Email: support@xenocrm.com
- Website: [www.xenocrm.com](https://www.xenocrm.com)

---

**Xeno CRM** - Transforming customer relationships with intelligent automation and powerful analytics.