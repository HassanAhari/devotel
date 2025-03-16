# Smart Insurance Application Portal

## Introduction
The **Smart Insurance Application Portal** is a dynamic web application built with Next.js (App Router) that allows users to apply for different types of insurance through dynamically generated forms. Users can submit applications, view and manage their submissions, and customize the displayed data.

## Features
### ✅ Smart Dynamic Forms
- Fetches form structures dynamically from an API.
- Conditional logic to show/hide fields based on user responses.
- Nested sections for complex forms (e.g., Address, Vehicle Details).
- Dynamic field options based on API responses.
- Validation before form submission.

### ✅ Customizable List View
- Displays submitted applications in a table.
- Users can customize which columns to display.
- Sorting, searching, and pagination.

### ✅ API Endpoints Used
- `GET /api/insurance/forms` → Fetches form structures.
- `POST /api/insurance/forms/submit` → Submits a completed form.
- `GET /api/insurance/forms/submissions` → Fetches submitted applications.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI Library**: Ant Design (AntD)
- **State Management**: Redux Toolkit
- **Drag & Drop**: DnD Kit
- **Internationalization**: Next-Intl

## Installation & Setup
### Prerequisites
- Node.js 18+
- npm or yarn

### Steps to Run Locally
1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/smart-insurance.git
   cd smart-insurance
   ```

2. **Install dependencies**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Visit [http://localhost:3000](http://localhost:3000).

## Deployment
This project is optimized for deployment on **Vercel**. It is currently live at [Smart Insurance Portal](https://devotel-three.vercel.app). To deploy:
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` and follow the setup instructions.

## Assumptions & Notes
- Forms are fully dynamic and fetched from an external API.
- Users can filter, sort, and paginate through submissions.
- Multi-language support is available via `next-intl`.
- Drag-and-drop functionality is used for customizing list views.

## Bonus Features
- 📝 **Autosave draft before submission**
- 🌙 **Dark mode support**
- 🌍 **Multi-language support**

## Contributing
Contributions are welcome! Feel free to submit a pull request.

## License
MIT License © 2024 Smart Insurance Application

