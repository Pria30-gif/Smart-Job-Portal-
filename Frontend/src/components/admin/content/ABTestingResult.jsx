import { useEffect, useState } from "react";
import { getABResult } from "./contentAPI";

export default function ABTestingResult() {
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    getABResult().then(res => setWinner(res.data));
  }, []);

  if (!winner) return <p>Loading...</p>;

  return (
    <div>
      <h3>Winner Selected 🎉</h3>
      <h4>{winner.title}</h4>
      <p>{winner.body}</p>
    </div>
  );
}
