import { useState } from "react";

function App() {
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("נא לבחור קובץ לצירוף");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const fileData = reader.result.split(",")[1]; // Base64 נקי
      const toList = recipients.split(",").map(email => email.trim()).filter(Boolean);

      try {
        for (const to of toList) {
          await window.api.sendMail({
            to,
            subject,
            body,
            fileName: file.name,
            fileBase64: fileData
          });
        }
        setMessage("הטיוטות נפתחו באאוטלוק 🎉");
      } catch (err) {
        console.error(err);
        setMessage("שגיאה בשליחת המייל");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>שליחת מייל</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input type="text" placeholder="נושא" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input type="text" placeholder="נמענים (מופרדים בפסיקים)" value={recipients} onChange={(e) => setRecipients(e.target.value)} />
        <textarea placeholder="גוף ההודעה" value={body} onChange={(e) => setBody(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">שלח</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default App;
