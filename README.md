# FrescAI Frontend - Fruit Freshness Classifier

React-based frontend for the FrescAI application that classifies fruits as fresh or rotten using deep learning.

![FrescAI Interface](path-to-screenshot.png)

## ✨ Features

- Drag-and-drop image upload
- Real-time image preview
- Multiple fruit type support
- Classification history tracking
- Detailed timing information
- Responsive design

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/winzyu/fruit-classifier-frontend.git
cd fruit-classifier-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## ⚙️ Configuration

The application expects the backend API to be running at `http://localhost:5000`. If you need to change this, modify the `API_URL` constant in `src/App.jsx`.

## 🛠️ Technologies Used

- **React**: UI library
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## 📁 Project Structure

```
fruit-classifier-frontend/
├── src/
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles
│   └── static/          # Static assets
└── tailwind.config.js   # Tailwind configuration
```

## 🔗 Related Repositories

- [AISC_fruits](https://github.com/your-username/AISC_fruits): Python backend service

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details
