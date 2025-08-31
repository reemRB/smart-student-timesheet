# SmartStudentTimesheet

## 🚀 Setup 
Install dependencies:
```bash
npm install
```

## ▶️ Start the project
```bash
npm run start
```

## 🧪 Run unit tests
```bash
npm run test
```

## 📚 How it works
SmartStudentTimesheet is an Angular project styled with Tailwind CSS that displays a **weekly timetable** for students.  
The backend is mocked via a **Postman API** with only two supported student IDs:
- `12345`
- `67890`

### SessionID
- Each student has a `sessionID` generated in Postman.
- It encodes the **class timestamp** (in ms) + the **studentId** using Base64.
- In Angular, the timestamp is decoded to determine the **active class**.

### Active & Next Class
- The timetable highlights the **current active class** (green pulsing border).
- If no class is active, the **next class** is highlighted (orange pulsing border).
- Classes repeat weekly, independent of calendar dates.

## 🎨 Features
- Weekly grid: **Monday → Sunday** rows with **hourly time slots**.
- Active/Next class highlight with **pulse animation**.
- Responsive design using Tailwind:
  - `xs` → small mobile
  - `sm` → mobile landscape
  - `md` → tablets
  - `lg` → laptops
  - `xl`, `2xl`, `3xl` → large monitors
- Overflow handling with horizontal scroll on small screens.

## 🖼️ Screenshots
*(Add screenshots of your timetable here)*

## 📦 Tech Stack
- Angular
- RxJS
- Tailwind CSS
- Postman (Mock API)
