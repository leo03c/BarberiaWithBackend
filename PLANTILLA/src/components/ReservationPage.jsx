// ReservationPage.jsx
import { useEffect } from "react";
import ReservationForm from "./ReservationForm";

function ReservationPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="py-16 px-8 bg-jetBlack">
      <ReservationForm /> {/* Llamamos al componente de reserva */}
    </div>
  );
}

export default ReservationPage;
